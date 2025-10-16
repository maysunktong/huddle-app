"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { addPostSchema } from "../schemas/zod.schemas";
import { slugify } from "../utils/slugify";
import { createServerClient } from "../utils/supabase/server";
import { uploadImages } from "../utils/supabase/upload-image";

const CreatePost = async (userdata: z.infer<typeof addPostSchema>) => {
  const parsedData = addPostSchema.parse(userdata);

  const files: File[] = [];
  const formData = userdata.images as FormData;

  if (formData && formData instanceof FormData) {
    for (const [, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        files.push(value);
      }
    }
  }

  const uploadedUrls = files.length > 0 ? await uploadImages(files) : [];

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not Authorized" };

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    slug: slugify(parsedData.title),
    ...parsedData,
    images: uploadedUrls,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
};

export default CreatePost;
