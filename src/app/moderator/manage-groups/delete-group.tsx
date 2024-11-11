"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ban, Trash2 } from "lucide-react";

export default function DeleteGroup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center group hover:cursor-pointer hover:bg-gray-200 rounded-lg p-2">
          <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 " />
          <span className="group-hover:text-red-500 ">Xóa nhóm</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only">Delete Group</DialogTitle>
        <DialogDescription className="sr-only">
          Make changes to your profile here. Click save when done.
        </DialogDescription>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-red-500">Xác nhận xóa nhóm</h1>
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa nhóm này không?
          </p>
        </div>
        <DialogFooter className="flex flex-col md:flex-row items-center mt-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant={"outline"}
              className="text-muted-foreground hover:border-[#ef4444] hover:bg-[#ff5d5d0a] hover:text-red-500 md:mb-0 mb-4 w-full md:w-28"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant={"destructive"}
            className=" ml-0 md:ml-2 w-full md:w-28"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
