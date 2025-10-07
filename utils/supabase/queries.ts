
import { QueryData } from "@supabase/supabase-js";
import { createClient } from "./client";

export const getHomePosts = async (
  supabase: ReturnType<typeof createClient>
) => {
  return await supabase
    .from("posts")
    .select("id, title, slug, created_at, profiles(id, username)")
    .order("created_at", { ascending: false });
};

export async function getUsersPosts(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: null };
  }

  return await supabase
    .from("posts")
    .select("id, title, slug, created_at, profiles(username)")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
}

export const getSinglePost = async (slug: string) => {
  const supabase = createClient();
  return await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single()
};

export const getSearchedPosts = async (
  searchTerm: string,
  signal: AbortSignal
) => {
  const supabase = createClient();

  return await supabase
    .from("posts")
    .select("title, slug")
    .ilike("title", `${searchTerm}%`)
    .abortSignal(signal);
};


export async function updatePost(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  values: { title?: string; slug?: string; content?: string }
) {
  const { data, error } = await supabase
    .from("posts")
    .update(values)
    .eq("id", postId)
    .select()
    .single();

  return { data, error };
}

export type HomePostsType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostsType = QueryData<ReturnType<typeof getSinglePost>>;
export type UsersPostsType = QueryData<ReturnType<typeof getUsersPosts>>;
export type UpdatePostType = QueryData<ReturnType<typeof updatePost>>;
