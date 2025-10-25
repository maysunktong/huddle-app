'use server'

import { createServerClient } from "../utils/supabase/server";

export async function deleteComment(commentId: string) {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized");

  const { data, error } = await supabase
    .from("comments")
    .update({ content: "This comment has been deleted." })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) throw error;

  return data;
}
