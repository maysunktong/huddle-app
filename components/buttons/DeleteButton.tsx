"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { deletePost } from "@/actions/delete-post";

type DeleteButtonProps = {
  postId: string;
};

export function DeleteButton({ postId }: DeleteButtonProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete post");
    },
  });

  return (
    <button type="button" onClick={() => mutate()} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
