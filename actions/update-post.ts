"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "../utils/supabase/server";
import { slugify } from "../utils/slugify";

export const UpdatePost = async (
  postId: string,
  values: { title?: string; slug?: string; content?: string }
) => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw Error("Not authorized");

  const { data: updatedPost, error: updatePostError } = await supabase
    .from("posts")
    .update(values)
    .eq("id", postId)
    .select("id, title")
    .single();
  if (updatePostError) console.error("Error updating post:", updatePostError);
  if (!updatedPost) return;

  /* update slug to new changes */
  const slug = `${slugify(updatedPost.title)}-${postId}`;
  const { error: slugError } = await supabase
    .from("posts")
    .update({ slug })
    .eq("id", postId);
  if (slugError) console.error("Error updating slug:", slugError);

/* Put create post on logs */
  const { error: activityLogError } = await supabase.from("logs")
    .insert({
      user_id: user.id,
      action: "Update post",
      entity: "Post is updated",
      entity_id: postId
    })
  if (activityLogError) console.error("Update Post Error", activityLogError.message);
  

  revalidatePath("/", "layout");
}
