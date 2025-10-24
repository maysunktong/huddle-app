import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { HomePostsType, getUserPosts } from "../utils/supabase/queries";
import { NoPostElement } from "./NoPostElement";
import PostCard from "./PostCard";
import { Card } from "./ui/card";
import { error } from "console";
import { createClient } from "../utils/supabase/client";

export default function UsersPosts({ posts }: { posts: HomePostsType }) {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    getUser();
  }, [supabase]);

  const { data, error } = useQuery({
    queryKey: ["user-posts", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await getUserPosts(supabase, currentUserId);
      if (error) throw new Error(error.message);
      return data;
    },
    initialData: posts,
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
    enabled: !!currentUserId,
  });

  return (
    <Card className="grid grid-cols-1 gap-6 max-w-3xl mx-auto h-full">
      {data.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </Card>
  );
}
