
import { QueryData } from "@supabase/supabase-js";
import { createClient } from "./client";
import { NestedComment, CommentSchema, CommentType } from "../../schemas/zod.schemas";

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
      images,
      author_id,
      created_at,
      profiles(id, username)
    `)
    .order("created_at", { ascending: false });
};

export async function getUserPosts(supabase: ReturnType<typeof createClient>, currentUserId: string) {
  return await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      slug,
      images,
      author_id,
      created_at,
      profiles(id, username)
    `)
    .eq("author_id", currentUserId)
    .order("created_at", { ascending: false });
}

export const getSinglePost = async (supabase: ReturnType<typeof createClient>, slug: string) => {
  return await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      slug,
      images,
      author_id,
      created_at,
      profiles(id, username, avatar_url)
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
  postId: string,
): Promise<NestedComment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  const comments = data?.map((c) => CommentSchema.parse(c)) || [];

  const map = new Map<string, NestedComment>();
  const roots: NestedComment[] = [];

  comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));
  map.forEach((c) => {
    if (c.parent_id) map.get(c.parent_id)?.replies.push(c);
    else roots.push(c);
  });

  return roots;
}

export async function insertComment(
  supabase: ReturnType<typeof createClient>,
  payload: Pick<CommentType, "content" | "post_id" | "user_id" | "parent_id">,
) {
  const { data, error } = await supabase
    .from("comments")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return CommentSchema.parse(data);
}

export type HomePostsType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostsType = QueryData<ReturnType<typeof getSinglePost>>;
export type UsersPostsType = QueryData<ReturnType<typeof getUserPosts>>;
export type ActivityLogsType = QueryData<ReturnType<typeof getActivityLogs>>
