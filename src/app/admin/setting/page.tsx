import AdminChangeInformation from "@/app/admin/setting/admin-change-information";
import AdminChangePassword from "@/app/admin/setting/admin-change-password";
import { Badge } from "@/components/ui/badge";
import React from "react";

export default function AdminSetting() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold text-muted-foreground tracking-tight sm:grow-0">
            Cài đặt
          </h1>
          <Badge
            variant="outline"
            className="ml-auto sm:ml-0 text-muted-foreground"
          >
            Quản trị viên
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <AdminChangeInformation />
          <AdminChangePassword />
        </div>
      </div>
    </main>
  );
}
