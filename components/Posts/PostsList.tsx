"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomePostsType, getHomePosts } from "../../utils/supabase/queries";
import { createClient } from "../../utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSettingButton } from "../buttons/CardSettingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PostsList({ posts }: { posts: HomePostsType }) {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
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
    <div className="grid grid-cols-1 gap-6 p-4 max-w-2xl mx-auto">
      {data &&
        data.map(({ id, title, content, slug, profiles, image }) => {
          const isOwner = profiles?.id === currentUserId;

          return (
            <Card
              key={id}
              className="relative group transition-all duration-200 hover:shadow-lg"
            >
              {isOwner && (
                <div className="absolute top-3 right-3 z-10">
                  <CardSettingButton postId={id} initialTitle={title} />
                </div>
              )}

              <CardHeader className="flex gap-4 justify-start items-center">
                <Avatar className="rounded-md">
                  <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <CardDescription className="text-sm text-muted-foreground">
                  by {profiles?.username}
                </CardDescription>
              </CardHeader>
              <Link href={`/posts/${slug}`}>
                <CardContent>
                  <CardTitle className="line-clamp-1 pb-4 font-semibold">{title}</CardTitle>
                  {image && (
                    <div className="px-4">
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

      {error && (
        <p className="text-red-500 text-center col-span-full">
          Error loading posts...
        </p>
      )}
    </div>
  );
}
