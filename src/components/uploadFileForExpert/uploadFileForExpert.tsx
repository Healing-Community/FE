"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, FolderUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn, getUserIdFromLocalStorage, handleErrorApi } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import certificateApiRequest from "@/apiRequests/expert";
import { CertificateSchemaType } from "@/schemaValidations/expert.schema";

import {
  useDeleteCertificate,
  useGetCertificatesByExpertId,
  useGetCertificateTypesQuery,
  useUploadFileForExpert,
} from "@/queries/useExpert";

import DialogExpertInfo from "@/components/expertInfo/dialog-expert-info";

import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function UploadFileForExpert() {
  const [filesByType, setFilesByType] = useState<{ [key: string]: File[] }>({});
  const [progressByType, setProgressByType] = useState<{
    [key: string]: {
      [fileName: string]: {
        progress: number;
        paused: boolean;
        uploaded?: boolean;
        certificateId?: string;
      };
    };
  }>({});
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [dragging, setDragging] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<
    { value: string; label: string }[]
  >([]); // State to hold document types

  const [uploadCompleted, setUploadCompleted] = useState(false);

  const expertId = getUserIdFromLocalStorage();

  const { data: certificatesData } = useGetCertificatesByExpertId(
    expertId as string
  );

  const { data: certificateTypesResponse } = useGetCertificateTypesQuery();

  const certificates = certificatesData?.payload.data;

  const certificateTypeMap = certificateTypesResponse?.payload.data.reduce(
    (acc, certificateType) => {
      acc[certificateType.certificateTypeId] = certificateType.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const uploadFileForExpert = useUploadFileForExpert(expertId as string);
  const deleteCertificate = useDeleteCertificate(expertId as string);

  useEffect(() => {
    const fetchCertificateTypes = async () => {
      try {
        const response = await certificateApiRequest.getCertificateTypes();
        const types = response.payload.data.map(
          (cert: CertificateSchemaType) => ({
            value: cert.certificateTypeId,
            label: cert.name,
          })
        );
        setDocumentTypes(types);
      } catch (error) {
        console.error("Failed to fetch certificate types", error);
      }
    };

    fetchCertificateTypes();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles && documentType) {
      const fileArray = Array.from(uploadedFiles);
      setFilesByType((prev) => ({
        ...prev,
        [documentType]: [...(prev[documentType] || []), ...fileArray],
      }));

      fileArray.forEach((file) => {
        setProgressByType((prev) => ({
          ...prev,
          [documentType]: {
            ...(prev[documentType] || {}),
            [file.name]: { progress: 0, paused: false },
          },
        }));
        simulateUploadProgress(file.name, documentType);
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = event.dataTransfer.files;
    const fileArray = Array.from(droppedFiles);
    if (documentType) {
      setFilesByType((prev) => ({
        ...prev,
        [documentType]: [...(prev[documentType] || []), ...fileArray],
      }));
      fileArray.forEach((file) => {
        setProgressByType((prev) => ({
          ...prev,
          [documentType]: {
            ...(prev[documentType] || {}),
            [file.name]: { progress: 0, paused: false },
          },
        }));
        simulateUploadProgress(file.name, documentType);
      });
    }
  };

  const simulateUploadProgress = (fileName: string, docType: string) => {
    const interval = setInterval(() => {
      setProgressByType((prev) => {
        const fileProgress = prev[docType]?.[fileName];
        if (!fileProgress || fileProgress.paused) return prev;

        const updatedProgress = fileProgress.progress + 20;
        if (updatedProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [docType]: {
              ...prev[docType],
              [fileName]: { ...fileProgress, progress: 100 },
            },
          };
        }
        return {
          ...prev,
          [docType]: {
            ...prev[docType],
            [fileName]: { ...fileProgress, progress: updatedProgress },
          },
        };
      });
    }, 500);
  };

  const handleDelete = (fileName: string, docType: string) => {
    setFilesByType((prev) => ({
      ...prev,
      [docType]: prev[docType].filter((file) => file.name !== fileName),
    }));
    setProgressByType((prev) => {
      const { [fileName]: _, ...rest } = prev[docType];
      return { ...prev, [docType]: rest };
    });
  };

  const handleSave = async () => {
    // Kiểm tra nếu chưa chọn loại tài liệu
    if (!documentType) {
      toast({
        title: "Vui lòng chọn Loại tài liệu",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra nếu chưa upload file nào
    if (!filesByType[documentType] || filesByType[documentType].length === 0) {
      toast({
        title: "Vui lòng tải lên tài liệu",
        variant: "destructive",
      });
      return;
    }

    try {
      let finalMessage = "";
      const uploadPromises = Object.entries(filesByType).map(
        async ([docType, files]) => {
          const fileUploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            try {
              const uploadResult = await uploadFileForExpert.mutateAsync({
                formData,
                certificationTypeId: docType,
              });

              finalMessage = uploadResult.payload.message;

              // Cập nhật progress với trạng thái uploaded
              setProgressByType((prev) => ({
                ...prev,
                [docType]: {
                  ...prev[docType],
                  [file.name]: {
                    ...prev[docType][file.name],
                    progress: 100,
                    paused: false,
                    uploaded: true,
                    certificateId: uploadResult.payload.data.certificateId, // Lưu certificateId
                  },
                },
              }));

              // Xóa file đã upload khỏi state
              setFilesByType((prev) => ({
                ...prev,
                [docType]: prev[docType].filter((f) => f.name !== file.name),
              }));

              return uploadResult;
            } catch (error) {
              console.error(`Error uploading ${file.name}:`, error);
              throw error;
            }
          });

          return Promise.all(fileUploadPromises);
        }
      );

      await Promise.all(uploadPromises);

      toast({
        title: "Tải lên tài liệu thành công",
        description: finalMessage,
        variant: "success",
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    try {
      // Kiểm tra xem certificateId có hợp lệ không
      if (!certificateId) {
        toast({
          title: "Không tìm thấy chứng chỉ để xóa",
          variant: "destructive",
        });
        return;
      }

      // Gọi API xóa chứng chỉ bằng certificateId
      await deleteCertificate.mutateAsync(certificateId);

      toast({
        title: "Xóa tệp thành công",
        variant: "success",
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="w-full bg-background h-auto p-4 max-w-7xl overflow-hidden mx-auto rounded-lg shadow-lg border">
      <div className="flex items-center justify-between">
        <h2 className="mb-2 text-2xl font-bold text-muted-foreground">
          Tải lên tài liệu
        </h2>
      </div>
      <p className="text-muted-foreground">Tải lên tài liệu bạn muốn chia sẻ</p>

      <div className="my-4">
        <h4 className="text-lg font-semibold mb-2 text-muted-foreground">
          Chọn loại tài liệu
        </h4>
        <div className=" flex gap-7 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="headerIcon"
                role="combobox"
                aria-expanded={open}
                className="w-[210px] justify-between border-gray-500 whitespace-normal"
              >
                {documentType
                  ? documentTypes.find((type) => type.value === documentType)
                      ?.label
                  : "Chọn loại tệp"}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search document..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No document type found.</CommandEmpty>
                  <CommandGroup>
                    {documentTypes.map((type) => (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={(currentValue) => {
                          setDocumentType(
                            currentValue === documentType ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        {type.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            documentType === type.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div>
            <span className="text-textChat">
              Bạn phải cung cấp đủ các chứng chỉ{" "}
              <span className="font-bold text-red-500">cần thiết sau đây </span>
              trước khi tạo lịch tư vấn:{" "}
              <span className="font-bold">Bằng cử nhân</span>,{" "}
              <span className="font-bold">Giấy phép hành nghề</span>,{" "}
              <span className="font-bold">CCCD</span>,{" "}
              <span className="font-bold">Ảnh thẻ</span>.
            </span>
          </div>
        </div>
      </div>

      <div
        className={`border-dashed border-2 p-4 mb-4 rounded-lg ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <FolderUp color="gray" />
          <span className="text-gray-600 ">Kéo và thả tệp ở đây</span>
          <span className="text-gray-600">Hoặc</span>

          <label htmlFor="file-upload">
            <Input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              variant="default"
            >
              Chọn tệp
            </Button>
          </label>
        </div>
      </div>

      <div className="b p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
          Tệp đã đăng
        </h3>

        {!uploadCompleted && (
          <ul>
            {Object.entries(filesByType).flatMap(([docType, files]) =>
              files
                .filter((file) => {
                  const fileProgress = progressByType[docType]?.[file.name];
                  return !fileProgress?.uploaded; // Chỉ hiển thị các tệp chưa tải lên
                })
                .map((file) => {
                  const fileProgress = progressByType[docType]?.[file.name];

                  return (
                    <li
                      key={`${docType}-${file.name}`}
                      className="mb-2 flex flex-col justify-start items-start border-2 p-4 rounded-lg"
                    >
                      <span className="text-muted-foreground mb-1">
                        {documentTypes.find((type) => type.value === docType)
                          ?.label || "Chưa chọn"}
                      </span>
                      <span className="text-muted-foreground">{file.name}</span>
                      <div className="flex items-center w-full">
                        <div className="flex-grow">
                          <Progress value={fileProgress?.progress || 0} />
                        </div>
                        <div className="flex items-center ml-4">
                          {fileProgress?.uploaded ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="ml-2">
                                  Xóa tệp
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-backgroundChat text-textChat">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Bạn có chắc chắn muốn xóa tệp này?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Thao tác này sẽ xóa vĩnh viễn tệp{" "}
                                    <span className="font-semibold text-red-500">
                                      {file.name}
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                  // onClick={() =>
                                  //   handleDeleteCertificate(file, docType)
                                  // }
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : fileProgress?.progress === 100 ? (
                            <>
                              <span className="text-green-600 font-semibold mr-2">
                                Thành công
                              </span>
                              <Button
                                onClick={() => handleDelete(file.name, docType)}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        )}

        <div className="">
          {certificates && certificates.length > 0 ? (
            certificates
              .filter((certificate) => certificate.status === 1)
              .map((certificate) => {
                // Đảm bảo certificateTypeMap không undefined
                const certificateTypeName =
                  certificateTypeMap?.[certificate.certificateTypeId] ||
                  "Loại không xác định";

                return (
                  <div
                    key={certificate.certificateId}
                    className="mb-2 flex flex-col justify-start items-start border-2 p-4 rounded-lg w-full"
                  >
                    <p className="text-muted-foreground mb-1 ">
                      {certificateTypeName}
                    </p>

                    <div className="flex items-center w-full">
                      <Link
                        key={certificate.certificateId}
                        href={certificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground flex-grow line-clamp-2"
                      >
                        <p className="text-sm text-muted-foreground flex-grow line-clamp-2">
                          {certificate.fileUrl || "Tên tệp không xác định"}
                        </p>
                      </Link>
                      <div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Xóa tệp
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-backgroundChat text-textChat">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn xóa tệp này?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Thao tác này sẽ xóa vĩnh viễn tệp
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCertificate(
                                    certificate.certificateId
                                  )
                                }
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-muted-foreground">Chưa có tệp nào được đăng.</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          variant="default"
          disabled={uploadFileForExpert.isPending}
        >
          {uploadFileForExpert.isPending ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
