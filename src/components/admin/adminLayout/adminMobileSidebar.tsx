"use client";
import adminItems from "@/components/admin/adminLayout/adminItems";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function AdminMobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetTitle className="sr-only">Are you absolutely sure?</SheetTitle>
        <SheetDescription className="sr-only">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </SheetDescription>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/admin/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
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
          {adminItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            return (
              <Link
                key={index}
                href={Item.href}
                className={cn(
                  "flex items-center gap-3 px-2.5  hover:text-foreground",
                  {
                    "text-foreground": isActive,
                    "text-muted-foreground": !isActive,
                  }
                )}
              >
                <Item.Icon className="h-4 w-4" />
                {Item.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
