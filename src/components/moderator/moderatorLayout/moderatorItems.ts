import {
  Cpu,
  MessageSquareWarning,
  PiggyBank,
  SquareUserRound,
  NotebookPen,
  SquareLibrary,
  UsersRound,
} from "lucide-react";

const moderatorItems = [
  {
    title: "Kiểm duyệt chứng chỉ",
    Icon: Cpu,
    href: "/moderator/manage-certificates",
  },
  {
    title: "Quản lí báo cáo",
    Icon: MessageSquareWarning,
    href: "/moderator/manage-reports/expert",
  },
  {
    title: "Lịch sử giao dịch",
    Icon: PiggyBank,
    href: "/moderator/transaction-history",
  },
  {
    title: "Quản lí tài khoản",
    Icon: SquareUserRound,
    href: "/moderator/manage-accounts",
  },

  // {
  //   title: "Quản lí blog",
  //   Icon: NotebookPen,
  //   href: "/moderator/manage-blogs",
  // },
  {
    title: "Quản lí thể loại",
    Icon: SquareLibrary,
    href: "/moderator/manage-category",
  },
  {
    title: "Quản lí nhóm",
    Icon: UsersRound,
    href: "/moderator/manage-groups",
  },
];

export default moderatorItems;
