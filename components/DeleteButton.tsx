"use client";

import { useMutation } from "@tanstack/react-query";
import { deletePost } from "@/actions/delete-post";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type DeleteButtonProps = {
  postId: string;
};

export function DeleteButton({ postId }: DeleteButtonProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      setTimeout(() => redirect("/"), 1000);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete post");
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={isPending}
      className="w-full flex flex-1 gap-2 justify-start items-center cursor-pointer"
    >
      <IconTrash />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
