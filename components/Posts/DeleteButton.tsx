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
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
