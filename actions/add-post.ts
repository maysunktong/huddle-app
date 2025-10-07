"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { addPostSchema } from "../schemas/zod.schemas";
import { slugify } from "../utils/slugify";
import { createServerClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

const AddPost = async (userdata: z.infer<typeof addPostSchema>) => {
  const parsedData = addPostSchema.parse(userdata);

  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  if (user) {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        title: parsedData.title,
        content: parsedData.body,
        slug: slugify(parsedData.title)
      });

    if (error) throw new Error(error.message)
  }

  revalidatePath("/", "layout");
};

export default AddPost;
