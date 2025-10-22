"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserPosts } from "../utils/supabase/queries";
import { NoPostElement } from "./NoPostElement";
import { createClient } from "../utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSettingButton } from "./CardSettingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";
import PostCard from "./PostCard";

export default function UsersPosts() {
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
  });

  const { data, error } = useQuery({
    queryKey: ["user-posts", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await getUserPosts(supabase, currentUserId);
      if (error) throw new Error(error.message);
      return data;
    },
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
  });

  if (error)
    return <p className="text-red-500 text-center">Error loading posts</p>;

  if (!data || data.length === 0) return <NoPostElement />;

  return (
    <Card className="grid grid-cols-1 gap-6 max-w-xl mx-auto h-full">
      {data?.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
      {error && (
        <p className="text-red-500 text-center col-span-full">
          Error loading posts...
        </p>
      )}
    </Card>
  );
}
