"use client";

import { useState } from "react";
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  SendHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  totalcomments: number;
  comments: Comment[];
}

const post: Post = {
  id: "1",
  user: {
    name: "Hoàng An",
    avatar:
      "https://firebasestorage.googleapis.com/v0/b/healing-community.appspot.com/o/banner%2Flotus-login.jpg?alt=media&token=b948162c-1908-43c1-8307-53ea209efc4d",
  },
  title: "Top 5 điểm ấn tượng trên iPhone 16 Pro: niềm vui trở lại",
  content: `
Đầu tiên, không thể không nhắc tới Apple Intelligence. Apple gọi đây là chiếc iPhone đầu tiên được tối ưu hóa nhất cho Apple Intelligence. Như vậy, mình có thể hiểu là iPhone 15 Pro thực chất chỉ là một sản phẩm demo cho những tính năng AI của Apple, chứ chưa phải là chiếc điện thoại tốt nhất chạy AI của Apple.

Camera Control: Không chỉ đơn giản là nút chụp hình

Cái thứ 2 mình muốn nói về là Camera Control, đây là tên gọi của nút bấm mới trên iPhone 16 Pro. Nó không chỉ đơn giản là một nút chụp hình như những tin đồn, mà nó thực sự là một cái nút hữu dụng hơn rất nhiều. Như mình đã đề cập ở trên, thì cái nút này cũng hỗ trợ Apple Intelligence, anh em có thể dùng nó để chụp một con chó và biết được nó là giống chó gì, hoặc chụp một nhà hàng và nó cho anh em biết những thông tin liên quan, thậm chí là có thể hướng dẫn anh em đi đến nhà hàng tương tự nhanh hơn.

Ngoài những tính năng liên quan đến Apple Intelligence, thì nó cũng có những tính năng đúng như tên gọi của nó - Camera Control. Anh em có thể sử dụng Camera Control để zoom in, zoom out khi chụp hình hoặc quay video, và cũng có thể dùng nó để chuyển đổi các chế độ, thay đổi tiêu cự và rất nhiều thứ khác. Mình sẽ có bài chi tiết hơn về nó khi được trên tay.

Kích thước màn hình được tăng lên

Điểm thứ 4 mình muốn nói tới là việc Apple đã phóng to cái màn hình iPhone 16 Pro và iPhone 16 Pro Max. Cụ thể, bây giờ iPhone 16 Pro anh em sẽ có màn hình 6.3 inch, và với iPhone 16 Pro Max anh em sẽ có màn hình lên tới 6.9 inch, có nghĩa là gần bằng với những chiếc máy tính bảng khoảng 10 năm trước.`,
  image:
    "https://firebasestorage.googleapis.com/v0/b/healing-community.appspot.com/o/banner%2Flotus-login.jpg?alt=media&token=b948162c-1908-43c1-8307-53ea209efc4d",
  timestamp: "10/9/2024 17:00",
  likes: 20,
  totalcomments: 10,
  comments: [],
};

export default function DetailPost() {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { theme } = useTheme();

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        user: {
          name: "Gia Minh",
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/healing-community.appspot.com/o/banner%2Flotus-login.jpg?alt=media&token=b948162c-1908-43c1-8307-53ea209efc4d",
        },
        content: newComment,
        timestamp: "Vừa xong",
        likes: 0,
      };

      post.comments.push(comment);
      setNewComment("");
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyContent.trim()) {
      const newReply: Comment = {
        id: `reply-${Date.now()}`,
        user: {
          name: "Gia Minh",
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/healing-community.appspot.com/o/banner%2Flotus-login.jpg?alt=media&token=b948162c-1908-43c1-8307-53ea209efc4d",
        },
        content: replyContent,
        timestamp: "Vừa xong",
        likes: 0,
      };

      const updateReplies = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateReplies(comment.replies),
            };
          }
          return comment;
        });
      };

      post.comments = updateReplies(post.comments);
      setReplyingTo(null);
      setReplyContent("");
    }
  };

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={`flex items-start gap-4 mb-2 ${depth > 0 ? "" : ""}`}
      >
        <Link href="#">
          <Avatar className="w-9 h-9 border-2 border-rose-300">
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-2 overflow-hidden break-words">
            <Link href="#">
              <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-violet-500">
                {comment.user.name}
              </span>
            </Link>

            <p className="text-black whitespace-pre-wrap break-all">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <button className="hover:underline">Thích</button>
            <button
              className="hover:underline"
              onClick={() => setReplyingTo(comment.id)}
            >
              Trả lời
            </button>
            <span>{comment.timestamp}</span>
            {comment.likes > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> {comment.likes}
              </span>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-2 flex items-center w-full relative">
              <div className="flex-1 mr-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => {
                    const textarea = e.target;
                    textarea.style.height = "auto";
                    textarea.style.height = `${textarea.scrollHeight}px`;
                    setReplyContent(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddReply(comment.id);
                    }
                  }}
                  className="border rounded-lg p-2 pr-10 w-full resize-none min-h-[40px] max-h-[120px] text-muted-foreground"
                  placeholder="Nhập trả lời..."
                />
              </div>
              <Button
                variant="iconSend"
                onClick={() => handleAddReply(comment.id)}
                className="absolute right-0"
              >
                <SendHorizontal className="h-5 w-5 hover:text-blue-500" />
              </Button>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {renderComments(comment.replies, depth + 1)}
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full relative">
      {/* Vertical icon bar */}
      <div className="absolute h-64 left-0 top-10 bottom-0 p-1 flex-col items-center justify-center lg:flex hidden">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Heart className="h-8 w-8 text-red-500" />
        </Button>
        <span className="text-xs font-semibold text-muted-foreground">
          {post.likes}
        </span>
        <Button variant="ghost" size="icon" className="rounded-full mt-5">
          <MessageCircle className="h-8 w-8 text-blue-500" />
        </Button>
        <span className="text-xs font-semibold text-muted-foreground">
          {post.totalcomments}
        </span>
        <Button variant="ghost" size="icon" className="rounded-full mt-5">
          <Share2 className="h-8 w-8 text-green-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full mt-7">
          <Bookmark className="h-8 w-8 text-purple-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full mt-7">
          <Flag className="h-8 w-8 text-red-500" />
        </Button>
      </div>

      {/* Main content */}
      <div className="lg:ml-16 w-auto mx-auto border shadow-md rounded-md overflow-hidden">
        {post.image && (
          <Image
            src={post.image}
            alt="Banner"
            width={1000}
            height={500}
            className="w-full h-[450px] object-cover"
          />
        )}

        <div className="flex items-center gap-2 px-4 py-8">
          <Link href="#">
            <Avatar className="w-12 h-12 border-2 border-rose-300">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href="#">
              <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-violet-500">
                {post.user.name}
              </p>
            </Link>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>

          {/* Mobile action buttons */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto lg:hidden">
              <Button variant="iconSend" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 mt-4 ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <DropdownMenuItem>
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Lưu bài viết</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="mr-2 h-4 w-4" />
                <span>Báo cáo bài viết</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h1 className="flex justify-center text-3xl px-4 font-bold text-muted-foreground">
          {post.title}
        </h1>
        <div className="px-4 py-5 space-y-4 textm">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}

          <div className="flex gap-10 justify-center text-muted-foreground">
            <span>#Chữa lành</span>
            <span>#Chữa lành</span>
            <span>#Chữa lành</span>
            <span>#Chữa lành</span>
          </div>
        </div>
        <div className="flex bg-gray-500 w-auto h-0.5 mx-8 mb-8"></div>

        {/* Mobile action buttons */}
        <div className="flex items-center justify-between py-2 mb-4 border-t border-b lg:hidden">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Heart className="h-5 w-5 text-red-500" />
            Thích
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Bình luận
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Share2 className="h-5 w-5 text-green-500" />
            Chia sẻ
          </Button>
        </div>

        {/* Comment section */}
        <div className="px-4 pb-3 space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Bình luận
          </h2>
          <div className="w-full flex items-center relative gap-4">
            <Link href="#">
              <Avatar className="w-9 h-9 border-2 border-rose-300">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name}</AvatarFallback>
              </Avatar>
            </Link>
            <textarea
              value={newComment}
              onChange={(e) => {
                const textarea = e.target;
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;
                setNewComment(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              className="border rounded-lg p-2 pr-10 w-full resize-none min-h-[40px] max-h-[120px] text-muted-foreground"
              placeholder="Nhập bình luận..."
            />
            <Button
              variant="iconSend"
              onClick={handleAddComment}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <SendHorizontal className="h-5 w-5 hover:text-blue-500" />
            </Button>
          </div>

          {/* reply comment */}
          <div className="w-full ">{renderComments(post.comments)}</div>
        </div>
      </div>
    </div>
  );
}
