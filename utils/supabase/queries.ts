
import { QueryData } from "@supabase/supabase-js";
import { createClient } from "./client";

export const getHomePosts = async (
  supabase: ReturnType<typeof createClient>
) => {
  return await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      slug,
      image,
      author_id,
      created_at,
      profiles(id, username)
    `)
    .order("created_at", { ascending: false });
};

export async function getUserPosts(supabase: ReturnType<typeof createClient>, userId: string) {
  return await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      slug,
      image,
      author_id,
      created_at,
      profiles(username)
    `)
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
}

export const getSinglePost = async (slug: string) => {
  const supabase = createClient();
  return await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      slug,
      image,
      author_id,
      created_at,
      profiles(username, avatar_url)
    `)
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
    .select(`
      id,
      title,
      content,
      slug,
      image,
      author_id,
      created_at,
      profiles(username)
    `)
    .single();

  return { data, error };
}

export async function getActivityLogs(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  values: { action?: string; slug?: string; content?: string }
) {
  const { data, error } = await supabase
    .from("logs")
    .update(values)
    .eq("id", userId)
    .select("id, action, entity, entity_id, created_at")
    .single();

  return { data, error };

}

export type HomePostsType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostsType = QueryData<ReturnType<typeof getSinglePost>>;
export type UsersPostsType = QueryData<ReturnType<typeof getUserPosts>>;
export type UpdatePostType = QueryData<ReturnType<typeof updatePost>>;
export type ActivityLogsType = QueryData<ReturnType<typeof getActivityLogs>>
