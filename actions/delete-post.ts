'use server'

import { revalidatePath } from "next/cache";
import { createServerClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export async function deletePost(postId: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw Error("Not authorized");

  const { data: post, error: deletePostError } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .select("id")
    .single();
  if (deletePostError) console.error("Delete post error:", deletePostError?.message || deletePostError);
  if (!post) return;

  const { error: activityLogError } = await supabase.from("logs")
    .insert({
      user_id: user.id,
      action: "Delete post",
      entity: "Post is deleted",
      entity_id: post.id
    })
  if (activityLogError) console.error("Create New Post Error", activityLogError.message);

  revalidatePath("/", "layout");
}
