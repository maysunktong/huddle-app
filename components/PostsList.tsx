"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomePostsType, getHomePosts } from "../utils/supabase/queries";
import { createClient } from "../utils/supabase/client";
import { Card } from "@/components/ui/card";
import PostCard from "./PostCard";

export default function PostsList({ posts }: { posts: HomePostsType }) {
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
    queryKey: ["home-posts"],
    queryFn: async () => {
      const { data, error } = await getHomePosts(supabase);
      if (error) throw new Error(error.message);
      return data;
    },
    initialData: posts,
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
  });

  return (
    <Card className="grid grid-cols-1 gap-6 max-w-3xl mx-auto h-full">
      {data?.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </Card>
  );
}
