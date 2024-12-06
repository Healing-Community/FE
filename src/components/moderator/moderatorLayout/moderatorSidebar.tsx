"use client";
import moderatorItems from "@/components/moderator/moderatorLayout/moderatorItems";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ModeratorSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/moderator/manage-groups"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/healing-community.appspot.com/o/logo%2Flogo.png?alt=media&token=4e7cda70-2c98-4185-a693-b03564f68a4c"
              alt="logo"
              width={24}
              height={24}
              sizes="icon"
            />
            <span className="sr-only">Acme Inc</span>
          </Link>

          {moderatorItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-accent-foreground md:h-8 md:w-8",
                      {
                        "bg-accent text-accent-foreground": isActive,
                        "text-muted-foreground": !isActive,
                      }
                    )}
                  >
                    <Item.Icon className="h-5 w-5" />
                    <span className="sr-only">{Item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{Item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        {/* nút cài đặt nằm bên dưới của thanh sidebar */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/moderator/setting"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
                  {
                    "bg-accent text-accent-foreground":
                      pathname === "/moderator/setting",
                    "text-muted-foreground": pathname !== "/moderator/setting",
                  }
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
