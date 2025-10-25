"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import CommentForm from "./comments/CommentForm";
import CommentItem from "./comments/CommentItem";
import { insertComment } from "../actions/insert-comment";
import { getCommentsForPost } from "../utils/supabase/queries";
import { deleteComment } from "../actions/delete-comment";
import { CommentType, CommentInsertType } from "@/schemas/zod.schemas";
import { toast } from "sonner";

export default function CommentList({
  postId,
  currentUserId,
}: {
  postId: string;
  currentUserId: string;
}) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: comments } = useQuery<CommentType[]>({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPost(supabase, postId),
  });

  const addCommentMutation = useMutation<
    CommentType,
    unknown,
    CommentInsertType
  >({
    mutationFn: (payload) => insertComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Your comment is added!");
    },
  });

  const handleAdd = async (content: string) => {
    if (!currentUserId) return;
    await addCommentMutation.mutateAsync({
      content,
      post_id: postId,
      user_id: currentUserId,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleDelete = async (commentId: string) => {
    await deleteMutation.mutateAsync(commentId);
  };

  return (
    <div className="space-y-6 px-2">
      <h3 className="text-lg font-semibold">Comments</h3>
      {currentUserId && <CommentForm onSubmit={handleAdd} />}
      <div className="space-y-4">
        {comments?.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUserId={currentUserId}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
