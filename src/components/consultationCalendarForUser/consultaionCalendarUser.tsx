"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  AlertCircle,
  Filter,
  CircleX,
  CircleHelp,
  Ellipsis,
  Star,
  MessageSquareWarning,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  useCancelAppointmentMutation,
  useCheckExpertRatingStatusQuery,
  useGetAppointmentForUser,
  useGetExpertProfileQuery,
} from "@/queries/useExpert";
import { AppointmentUserType } from "@/schemaValidations/expert.schema";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate, handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import DialogRateExpert from "@/components/consultationCalendarForUser/dialogRateExpert";
import ReportExpertSection from "@/components/reportSection/report-expert-section";

const ExpertAvatar = ({ expertId }: { expertId: string }) => {
  const { data } = useGetExpertProfileQuery(expertId);
  const expertProfile = data?.payload.data;
  return (
    <Avatar>
      <AvatarImage
        src={
          expertProfile?.profileImageUrl ||
          "https://firebasestorage.googleapis.com/v0/b/healing-community.appspot.com/o/banner%2Flotus-login.jpg?alt=media&token=b948162c-1908-43c1-8307-53ea209efc4d"
        }
        alt={expertProfile?.fullname}
      />
      <AvatarFallback>{expertProfile?.fullname.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default function ConsultationSchedule() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<
    string | null
  >(null);
  const { theme } = useTheme();
  const { data } = useGetAppointmentForUser();
  const appointmentUserList = React.useMemo(
    () => data?.payload.data || [],
    [data]
  );
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const filteredAndSortedConsultations = React.useMemo(() => {
    let filtered = [...appointmentUserList];

    if (startDate) {
      filtered = filtered.filter((c) => c.appointmentDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((c) => c.appointmentDate <= endDate);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }, [appointmentUserList, startDate, endDate, sortOrder]);

  const consultationsByStatus = React.useMemo(() => {
    return {
      upcoming: filteredAndSortedConsultations.filter((c) =>
        ["Đang diễn ra", "Sắp diễn ra"].includes(c.tag)
      ),
      completed: filteredAndSortedConsultations.filter((c) =>
        [
          "Đã hoàn thành",
          "Chuyển tiền cho chuyên gia",
          "Chờ báo cáo",
          "Hoàn tiền cho người dùng",
          "Duyệt báo cáo người dùng thành công",
          "Duyệt báo cáo người dùng thất bại",
          "Chuyển tiền cho người dùng",
        ].includes(c.tag)
      ),
      cancelled: filteredAndSortedConsultations.filter((c) =>
        ["Đã hủy"].includes(c.tag)
      ),
    };
  }, [filteredAndSortedConsultations]);

  const { mutate: cancelAppointment } = useCancelAppointmentMutation();

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointment(
      { appointmentId },
      {
        onSuccess: () => {
          toast({
            title: "Hủy lịch tư vấn thành công",
            variant: "success",
          });
        },
        onError: (error) => {
          handleErrorApi({ error });
        },
      }
    );
  };

  // const checkRatingStatus = useCheckExpertRatingStatusQuery({
  //   appointmentId: selectedAppointmentId as string,
  //   enabled: !!selectedAppointmentId,
  // });

  const renderConsultationCard = (consultation: AppointmentUserType) => {
    // Tính toán thời gian bắt đầu của cuộc hẹn
    const currentTime = new Date();
    const appointmentStart = new Date(
      `${consultation.appointmentDate}T${
        consultation.timeRange.split(" - ")[0]
      }`
    );
    const appointmentEnd = new Date(
      `${consultation.appointmentDate}T${
        consultation.timeRange.split(" - ")[1]
      }`
    );
    const canCancel =
      consultation.tag === "Sắp diễn ra" &&
      appointmentStart.getTime() - currentTime.getTime() > 24 * 60 * 60 * 1000;

    //sau 2 ngày kh còn đc report nữa
    const canReport =
      consultation.tag === "Đã hoàn thành" &&
      appointmentEnd.getTime() + 2 * 24 * 60 * 60 * 1000 >
        currentTime.getTime();

    const shouldDropdown = consultation.tag === "Đã hoàn thành";
    const handleOpenDialog = (appointmentId: string) => {
      setSelectedAppointmentId(appointmentId);
      setIsDialogOpen(true);
    };

    const shouldShowRating =
      // checkRatingStatus.data?.payload.data === false &&
      consultation.tag === "Đã hoàn thành";

    const openReportDialog = () => {
      setSelectedAppointmentId(consultation.appointmentId);
      setIsReportDialogOpen(true);
    };

    return (
      <Card key={consultation.appointmentId} className="mb-4 relative">
        {/* Hủy lịch hẹn */}
        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
              >
                <CircleX className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-backgroundChat text-red-500">
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận hủy lịch</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn hủy lịch ngày{" "}
                  <span className="text-red-500">
                    {consultation.appointmentDate}
                  </span>{" "}
                  vào lúc{" "}
                  <span className="text-red-500">{consultation.timeRange}</span>{" "}
                  không? Nếu hủy lịch thì chúng tôi sẽ hoàn{" "}
                  <span className="text-green-500">
                    {formatCurrency(consultation.amount)}
                  </span>{" "}
                  về tài khoản của bạn trong vòng{" "}
                  <span className="font-bold">24 giờ</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white"
                  onClick={() =>
                    handleCancelAppointment(consultation.appointmentId)
                  }
                >
                  Xác nhận
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {shouldDropdown && (
          <DropdownMenu modal={false} aria-hidden={false}>
            <DropdownMenuTrigger asChild className="ml-auto">
              <Button
                variant="iconSend"
                className="absolute top-2 right-2 z-10"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 mt-4 ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {shouldShowRating && (
                <DropdownMenuItem
                  onClick={() => handleOpenDialog(consultation.appointmentId)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  <span>Đánh giá</span>
                </DropdownMenuItem>
              )}

              {canReport && (
                <DropdownMenuItem onClick={openReportDialog}>
                  <MessageSquareWarning className="mr-2 h-4 w-4" />
                  <span>Báo cáo</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DialogRateExpert
          isOpen={isDialogOpen}
          setIsOpen={(value) => {
            if (!value) setSelectedAppointmentId(null); // Reset khi đóng dialog
            setIsDialogOpen(value);
          }}
          appointmentId={selectedAppointmentId}
          expertProfileId={consultation.expertId}
        />
        <ReportExpertSection
          appoinmtentId={selectedAppointmentId as string}
          isOpen={isReportDialogOpen}
          setIsOpen={(value) => {
            if (!value) setSelectedAppointmentId(null); // Reset khi đóng dialog
            setIsReportDialogOpen(value);
          }}
        />

        <CardHeader className="flex flex-row items-center gap-4">
          <ExpertAvatar expertId={consultation.expertId} />
          <div>
            <CardTitle className="text-lg">{consultation.name}</CardTitle>
            <CardDescription>Chuyên gia tư vấn tâm lý</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(consultation.appointmentDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{consultation.timeRange}</span>
            </div>
            {["Sắp diễn ra", "Đã thanh toán"].includes(consultation.tag) && (
              <div className="flex items-center space-x-2 underline text-blue-500">
                <Video className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={consultation.meetLink}
                  className="text-sm hover:underline"
                >
                  Tham gia buổi tư vấn
                </Link>
              </div>
            )}
            <div className="text-right">
              {["Sắp diễn ra", "Đã thanh toán"].includes(consultation.tag) && (
                <Badge variant="secondary">Sắp diễn ra</Badge>
              )}
              {consultation.tag === "Đã hoàn thành" && (
                <Badge variant="success">Đã hoàn thành</Badge>
              )}
              {consultation.tag === "Đã hủy" && (
                <Badge variant="destructive">Đã hủy</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (filteredAndSortedConsultations.length === 0) {
    return (
      <div>
        <div className="p-4 mt-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-textChat">
            Lịch Tư Vấn Của Bạn
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] text-textChat">
                <Filter className="mr-2 h-4 w-4" />
                Lọc và Sắp xếp
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none text-textChat">
                    Lọc theo ngày
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1.5 ">
                      <Label htmlFor="startDate">Từ ngày</Label>
                      <Input
                        id="startDate"
                        type="date"
                        variant={"subtle"}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="endDate">Đến ngày</Label>
                      <Input
                        id="endDate"
                        type="date"
                        variant={"subtle"}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Sắp xếp</h4>
                  <Select
                    value={sortOrder}
                    onValueChange={(value: "asc" | "desc") =>
                      setSortOrder(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thứ tự sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Cũ nhất trước</SelectItem>
                      <SelectItem value="desc">Mới nhất trước</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Alert className="text-center font-bold text-textChat mt-10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xl font-semibold">
            Chưa có lịch tư vấn
          </AlertTitle>
          <AlertDescription>
            Bạn chưa có lịch tư vấn nào. Hãy đặt lịch với chuyên gia để được tư
            vấn riêng.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-textChat">
          Lịch Tư Vấn Của Bạn
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] text-textChat">
              <Filter className="mr-2 h-4 w-4" />
              Lọc và Sắp xếp
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-textChat">
                  Lọc theo ngày
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1.5 ">
                    <Label htmlFor="startDate">Từ ngày</Label>
                    <Input
                      id="startDate"
                      type="date"
                      variant={"subtle"}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="endDate">Đến ngày</Label>
                    <Input
                      id="endDate"
                      type="date"
                      variant={"subtle"}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Sắp xếp</h4>
                <Select
                  value={sortOrder}
                  onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thứ tự sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Cũ nhất trước</SelectItem>
                    <SelectItem value="desc">Mới nhất trước</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Column */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Sắp diễn ra ({consultationsByStatus.upcoming.length})
            <HoverCard>
              <HoverCardTrigger asChild>
                <CircleHelp className="ml-2 h-5 w-5 text-textChat" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-red-600">
                    Lưu ý
                  </h3>
                  <span className="text-sm">
                    Bạn chỉ có thể hủy lịch tư vấn trước thời gian bắt đầu 24
                    giờ
                  </span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </h2>

          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="space-y-4 pr-4">
              {consultationsByStatus.upcoming.map(renderConsultationCard)}
            </div>
          </ScrollArea>
        </div>

        {/* Completed Column */}
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700 dark:text-green-300">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Đã hoàn thành ({consultationsByStatus.completed.length})
          </h2>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="space-y-4 pr-4">
              {consultationsByStatus.completed.map(renderConsultationCard)}
            </div>
          </ScrollArea>
        </div>

        {/* Cancelled Column */}
        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700 dark:text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Đã hủy ({consultationsByStatus.cancelled.length})
          </h2>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="space-y-4 pr-4">
              {consultationsByStatus.cancelled.map(renderConsultationCard)}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
