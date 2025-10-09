"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { addPostSchema } from "../schemas/zod.schemas";
import { slugify } from "../utils/slugify";
import { createServerClient } from "../utils/supabase/server";
import { uploadImage } from "../utils/supabase/upload-image";

const CreatePost = async (userdata: z.infer<typeof addPostSchema>) => {
  const parsedData = addPostSchema.parse(userdata);

  const supabase = await createServerClient();

  const imageFile = userdata.image?.get('image');
  if (!(imageFile instanceof File) && imageFile !== null) {
    throw new Error("Malformed image file")
  }

  const publicImageUrl = imageFile ? await uploadImage(imageFile) : null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  if (user) {
    const { error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        slug: slugify(parsedData.title),
        ...parsedData,
        image: publicImageUrl
      });

    if (error) throw new Error(error.message)
  }

  revalidatePath("/", "layout");
};

export default CreatePost;
