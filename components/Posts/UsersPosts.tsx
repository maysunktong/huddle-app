"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";
import { DeleteButton } from "../buttons/DeleteButton";
import { EditButton } from "../buttons/EditButton";
import { CardSettingButton } from "../buttons/CardSettingButton";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UsersPosts() {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ Fetch current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
    };
    getUser();
  }, [supabase]);

  // ✅ Fetch posts belonging to user
  const { data, error } = useQuery({
    queryKey: ["users-posts"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, title, slug, content, created_at, author_id, profiles(username), image"
        )
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
  });

  if (error)
    return <p className="text-red-500 text-center">Error loading posts</p>;
  if (!data) return <p className="text-center">Loading...</p>;
  if (data.length === 0)
    return <p className="text-center text-gray-500">No posts found.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 p-4 max-w-2xl mx-auto">
      {data.map(({ id, title, content, slug, profiles, image, author_id }) => {
        const isOwner = author_id === currentUserId;

        return (
          <Card
            key={id}
            className="relative group transition-all duration-200 hover:shadow-lg"
          >
            {/* Floating Settings Button */}
            {isOwner && (
              <div className="absolute top-3 right-3 z-10">
                <CardSettingButton postId={id} initialTitle={title} />
              </div>
            )}

            {/* Header */}
            <CardHeader className="flex gap-2 justify-start items-center">
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
            </CardHeader>

            {/* Content */}
            <Link href={`/posts/${slug}`}>
              <CardContent>
                <CardTitle className="text-2xl pb-6 font-semibold">
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
