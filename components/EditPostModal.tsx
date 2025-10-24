"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { CardSettingTypes } from "./CardSettingButton";
import { UpdatePost } from "../actions/update-post";

export function EditPostModal({
  postId,
  initialTitle,
  initialContent,
}: CardSettingTypes) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || "");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await UpdatePost(postId, { title: title.trim(), content });
    },
    onSuccess: () => {
      toast.success("Post is updated!");
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update post");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="border-0 w-full flex justify-start items-center shadow-0"
        >
          <PencilIcon />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Post Title</DialogTitle>
          <DialogDescription>
            Update the title of your post below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">New Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">New Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter new content"
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => mutate()}
            disabled={isPending || !title.trim()}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
