"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserPosts } from "../utils/supabase/queries";
import { CardSettingButton } from "./CardSettingButton";
import { NoPostElement } from "./NoPostElement";
import { Card, CardContent, CardTitle } from "./ui/card";
import { createClient } from "../utils/supabase/client";

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
  }, [supabase]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["user-posts", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await getUserPosts(supabase, currentUserId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!currentUserId,
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
  });

  if (error)
    return <p className="text-red-500 text-center">Error loading posts</p>;
  if (!data) return <p className="text-center">Loading...</p>;
  if (data.length === 0) return <NoPostElement />;

  return (
    <div className="grid grid-col-1 gap-6 max-w-xl mx-auto">
      {data.map(({ id, title, content, slug, profiles, image, author_id }) => {
        const isOwner = author_id === currentUserId;

        return (
          <Card key={id} className="relative group transition-all duration-200">
            {/* Floating Settings Button */}
            {isOwner && (
              <div className="absolute top-5 right-1 z-10">
                <CardSettingButton postId={id} initialTitle={title} />
              </div>
            )}

            {/* Header */}
            {/* <CardHeader className="flex gap-2 justify-start items-center">
              <Avatar className="rounded-md">
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <CardDescription className="text-sm text-muted-foreground">
                by {profiles?.username ?? "Unknown"}
              </CardDescription>
            </CardHeader> */}

            {/* Content */}
            <Link href={`/posts/${slug}`}>
              <CardContent>
                <CardTitle className="text-lg pb-6 font-semibold">
                  {title}
                </CardTitle>

                {image && (
                  <div>
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover rounded-md border"
                    />
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {content}
                </p>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
