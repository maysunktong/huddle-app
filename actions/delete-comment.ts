'use server'

import { createServerClient } from "../utils/supabase/server";

export async function deleteComment(commentId: string, currentUserId: string) {
  const supabase = await createServerClient();
  const { data: commentData, error: fetchError } = await supabase
    .from("comments")
    .select("id, user_id, post_id, posts(author_id)")
    .eq("id", commentId)
    .single();

  if (fetchError || !commentData) throw new Error("Comment not found");

  const postAuthorId = commentData.posts.author_id;

  if (currentUserId !== commentData.user_id && currentUserId !== postAuthorId) {
    throw new Error("Not authorized");
  }

  const { data, error } = await supabase
    .from("comments")
    .update({ content: "This comment has been deleted." })
    .eq("id", commentId);

  if (error) throw error;

  return data;
}
