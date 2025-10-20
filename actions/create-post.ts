"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { addPostSchema } from "../schemas/zod.schemas";
import { slugify } from "../utils/slugify";
import { createServerClient } from "../utils/supabase/server";
import { uploadImages } from "../utils/supabase/upload-image";

export const CreatePost = async (userdata: z.infer<typeof addPostSchema>) => {
  const parsedData = addPostSchema.parse(userdata);

  const imageFiles: File[] = [];
  const imagesData = userdata.images as FormData;

  if (imagesData && imagesData instanceof FormData) {
    for (const [, value] of imagesData.entries()) {
      if (value instanceof File && value.size > 0) {
        imageFiles.push(value);
      }
    }
  }

  const uploadedUrls = imageFiles.length > 0 ? await uploadImages(imageFiles) : [];

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw Error("Not authorized");

  const { data: post, error: postInsertError } = await supabase.from("posts")
    .insert({
      author_id: user.id,
      slug: slugify(parsedData.title),
      ...parsedData,
      images: uploadedUrls,
    })
    .select("id")
    .single();
  if (postInsertError) {
    console.error("Post insert error:", postInsertError?.message || postInsertError);
    throw postInsertError;
  }
  if (!post) return;

  /* Update the slug followed by post.id */
  const slug = `${slugify(parsedData.title)}-${post.id}`;
  const { error: updateError } = await supabase
    .from("posts")
    .update({ slug })
    .eq("id", post.id);

  if (updateError) console.error("Slug update error:", updateError.message);


  /* Put create post on logs */
  const { error: activityLogError } = await supabase.from("logs")
    .insert({
      user_id: user.id,
      action: "Create new post",
      entity: "New post",
      entity_id: post.id
    })
  if (activityLogError) console.error("Create New Post Error", activityLogError.message);

  revalidatePath("/", "layout");
};
