"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";
import { updatePost } from "../../utils/supabase/queries";

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

export function EditButton({
  postId,
  initialTitle,
}: {
  postId: string;
  initialTitle: string;
}) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await updatePost(supabase, postId, { title });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Post title updated!");
      queryClient.invalidateQueries({ queryKey: ["home-posts"] });
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
        <Button variant="ghost" size="sm" className="border-0 w-full flex justify-start items-center shadow-0 cursor-pointer">
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
