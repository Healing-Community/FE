"use client";

import UserHeaderInGroup from "@/app/user/group/[groupId]/user-header-in-group";
import ReactionCount from "@/components/homePage/reactionCount";
import ReactionEmoji from "@/components/homePage/reactionEmoji";
import { useGetPersonalPostGroupQuery } from "@/queries/usePost";
import Image from "next/image";
import { motion } from "framer-motion";
import { createContext, useState } from "react";
import { GetPersonalPostGroupListResType } from "@/schemaValidations/post.schema";
import { getUserIdFromLocalStorage } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import AlertDialogDeletePersonalPostInGroup from "@/app/user/group-user/[groupId]/user/[userId]/delete-personal-post-in-group";
import EditPersonalPostInGroup from "@/app/user/group-user/[groupId]/user/[userId]/edit-personal-post-in-group";

type PersonalPostInGroupItem = GetPersonalPostGroupListResType["data"][0];
const PersonalPostInGroupContext = createContext<{
  postId: string | undefined;
  setPostId: (value: string | undefined) => void;
  postDelete: PersonalPostInGroupItem | null;
  setPostDelete: (value: PersonalPostInGroupItem | null) => void;
}>({
  postId: undefined,
  setPostId: (value: string | undefined) => {},
  postDelete: null,
  setPostDelete: (value: PersonalPostInGroupItem | null) => {},
});

export default function ViewPersonalPostInGroup({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const userIdFromLocalStorage = getUserIdFromLocalStorage();
  const { theme } = useTheme();
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const [postDelete, setPostDelete] = useState<PersonalPostInGroupItem | null>(
    null
  );
  // Trạng thái lưu thông tin mở rộng của từng bài viết
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  // Hàm kiểm tra xem một bài viết có cần bị rút gọn không
  const shouldTruncateDescription = (description: string): boolean => {
    const MAX_LENGTH = 300; // Chiều dài tối đa trước khi rút gọn
    return description.length > MAX_LENGTH;
  };

  // Hàm chuyển đổi trạng thái mở rộng cho từng bài viết
  const toggleExpand = (postId: string, shouldExpand: boolean) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: shouldExpand,
    }));
  };

  const { data } = useGetPersonalPostGroupQuery({ groupId, userId });
  const personalPostListInGroup = data?.payload.data || [];

  return (
    <PersonalPostInGroupContext.Provider
      value={{
        postId,
        setPostId,
        postDelete,
        setPostDelete,
      }}
    >
      <div className="my-4">
        {personalPostListInGroup.length === 0 ? (
          <div className="max-w-4xl mx-auto text-textChat text-center p-4 rounded-lg shadow-lg border mb-6">
            Hiện chưa có bài viết nào
          </div>
        ) : (
          personalPostListInGroup.map((post) => {
            const isExpanded = expandedPosts[post.postId] || false;
            const truncate = shouldTruncateDescription(post.description);
            const openDeletePost = () => {
              setPostDelete(post);
            };
            const openEditPost = () => {
              setPostId(post.postId);
            };

            const shouldRenderDropdown = userIdFromLocalStorage === userId;

            return (
              <div
                key={post.postId}
                className="max-w-4xl mx-auto mb-6 rounded-lg shadow-lg border"
              >
                <Image
                  src={post.coverImgUrl}
                  alt="Banner"
                  width={1000}
                  height={500}
                  priority={true}
                  className="w-full h-[250px] object-cover rounded-t-lg"
                />
                {/* Header with name, avatar, post create at, dropdown edit and delete */}
                <div className="flex items-center gap-4 mb-6 p-4">
                  <UserHeaderInGroup
                    userId={userId}
                    createPost={post.createAt}
                    groupId={groupId}
                  />
                  {/* Chỗ này có thể là dropdown nếu cần */}
                  {shouldRenderDropdown ? (
                    <DropdownMenu modal={false} aria-hidden={false}>
                      <DropdownMenuTrigger asChild className="ml-auto">
                        <Button variant="iconSend">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className={`w-56 mt-4 ${
                          theme === "dark"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <DropdownMenuItem onClick={openEditPost}>
                          <FilePenLine className="mr-2 h-4 w-4" />
                          <span>Sửa bài viết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeletePost}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa bài viết</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
                <AlertDialogDeletePersonalPostInGroup
                  postDelete={postDelete}
                  setPostDelete={setPostDelete}
                  userId={userId}
                  groupId={groupId}
                />
                <EditPersonalPostInGroup
                  postId={postId}
                  setPostId={setPostId}
                  onSubmitSuccess={() => {}}
                />
                {/* Title and content */}
                <motion.div
                  animate={{ height: isExpanded ? "auto" : 300 }} // auto cho phép nội dung mở rộng tự nhiên
                  initial={{ height: 300 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="whitespace-pre-wrap mb-4 text-textChat p-4">
                    <div className="font-bold text-lg text-center mb-2">
                      {post.title}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: post.description,
                      }}
                    />
                  </div>
                </motion.div>

                {truncate && (
                  <div className="flex justify-end p-4">
                    <button
                      onClick={() => toggleExpand(post.postId, !isExpanded)}
                      className="text-blue-500 hover:underline focus:outline-none mt-2 mb-3"
                    >
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  </div>
                )}
                {/* Reaction, Comment */}
                <div className="flex flex-col items-start gap-4 p-4">
                  <div className="flex justify-between w-full">
                    <ReactionCount postId={post.postId} />
                    <span className="justify-end text-sm text-gray-500"></span>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <ReactionEmoji postId={post.postId} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PersonalPostInGroupContext.Provider>
  );
}
