"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import CommentForm from "./comments/CommentForm";
import CommentItem from "./comments/CommentItem";
import { insertComment } from "../actions/insert-comment";
import { getCommentsForPost } from "../utils/supabase/queries";
import { deleteComment } from "../actions/delete-comment";

export default function CommentList({
  postId,
  currentUserId,
}: {
  postId: string;
  currentUserId: string | null;
}) {
  const supabase = createClient();
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPost(supabase, postId),
  });

  const mutation = useMutation({
    mutationFn: ({
      content,
      parent_id,
    }: {
      content: string;
      parent_id: string | null;
    }) =>
      insertComment({
        content,
        parent_id,
        post_id: postId,
        user_id: currentUserId ?? "",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const handleAdd = async (content: string, parentId: string | null = null) => {
    if (!currentUserId) return;
    await mutation.mutateAsync({ content, parent_id: parentId });
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const handleDelete = async (commentId: string) => {
    await deleteMutation.mutateAsync(commentId);
  };

  return (
    <div className="space-y-6 mt-10 px-2">
      <h3 className="text-lg font-semibold">Comments</h3>
      {currentUserId && <CommentForm onSubmit={(v) => handleAdd(v, null)} />}
      <div className="space-y-4">
        {comments?.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onReply={(parentId, value) => handleAdd(value, parentId)}
            onDelete={(parentId) => handleDelete(parentId)}
          />
        ))}
      </div>
    </div>
  );
}
