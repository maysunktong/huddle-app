'use server'

import { createServerClient } from "../utils/supabase/server";

export async function deleteComment(commentId: string, currentUserId: string) {
  const supabase = await createServerClient();

  // Fetch the comment with the post author
  const { data: commentData, error: fetchError } = await supabase
    .from("comments")
    .select("id, user_id, post_id, posts(author_id)")
    .eq("id", commentId)
    .single();

  if (fetchError || !commentData) throw new Error("Comment not found");

  const postAuthorId = commentData.posts.author_id;

  // Only the comment owner or post owner can delete
  if (currentUserId !== commentData.user_id && currentUserId !== postAuthorId) {
    throw new Error("Not authorized");
  }

  // Soft delete
  const { data, error } = await supabase
    .from("comments")
    .update({ content: "This comment has been deleted." })
    .eq("id", commentId);

  if (error) throw error;

  return data;
}
