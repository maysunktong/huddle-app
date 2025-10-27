import { QueryData } from "@supabase/supabase-js";
import { createClient } from "./client";
import { CommentType } from "../../schemas/zod.schemas";

export async function getHomePosts(supabase: ReturnType<typeof createClient>) {
  return await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      slug,
      images,
      author_id,
      created_at,
      profiles(id, username)
    `
    )
    .order("created_at", { ascending: false });
}

export async function getUserPosts(
  supabase: ReturnType<typeof createClient>,
  currentUserId: string
) {
  return await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      slug,
      images,
      author_id,
      created_at,
      profiles(id, username)
    `
    )
    .eq("author_id", currentUserId)
    .order("created_at", { ascending: false });
}

export async function getSinglePost(
  supabase: ReturnType<typeof createClient>,
  slug: string
) {
  return await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      slug,
      images,
      author_id,
      created_at,
      profiles(id, username, avatar_url)
    `
    )
    .eq("slug", slug)
    .single();
}

export async function getSearchedPosts(
  supabase: ReturnType<typeof createClient>,
  searchTerm: string,
  signal: AbortSignal
) {
  return await supabase
    .from("posts")
    .select(
      "id, title, content, slug, images, author_id, created_at, profiles(id, username)"
    )
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .abortSignal(signal);
}


export async function getActivityLogs(
  supabase: ReturnType<typeof createClient>,
  currentUserId: string
) {
  return await supabase
    .from("logs")
    .select("id, action, entity, entity_id, created_at, user_id")
    .eq("user_id", currentUserId)
    .order("created_at", { ascending: false });
}

export async function getCommentsForPost(
  supabase: ReturnType<typeof createClient>,
  postId: string
): Promise<CommentType[]> {
  const { data: AllComments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles (
        id,
        username,
        avatar_url
      )
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return AllComments.map((comment) => ({
    ...comment,
    profile: comment.profiles && {
      username: comment.profiles.username,
      avatar_url: comment.profiles.avatar_url,
    },
  }));
}

export async function getCommentCount(
  supabase: ReturnType<typeof createClient>,
  postId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) throw error;
  return count ?? 0;
}

export type HomePostsType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostsType = QueryData<ReturnType<typeof getSinglePost>>;
export type UsersPostsType = QueryData<ReturnType<typeof getUserPosts>>;
export type ActivityLogsType = QueryData<ReturnType<typeof getActivityLogs>>;
