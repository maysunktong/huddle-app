"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { updatePost } from "../utils/supabase/queries";

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
import { slugify } from "../utils/slugify";
import { CardSettingTypes } from "./CardSettingButton";

export function EditButton({
  postId,
  initialTitle,
  initialContent,
}: CardSettingTypes) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || "");

  const mutation = useMutation({
    mutationFn: async () => {
      const slug = slugify(title);
      const { data, error } = await updatePost(supabase, postId, {
        title,
        content,
        slug
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Post is updated!");
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update post");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
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

      {/* Content */}
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

        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !title.trim()}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
