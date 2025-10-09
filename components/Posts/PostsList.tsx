"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomePostsType, getHomePosts } from "../../utils/supabase/queries";
import { createClient } from "../../utils/supabase/client";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./UpdateButton";

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
    <div className="flex flex-col space-y-2">
      {data &&
        data.map(({ id, title, content, slug, profiles, image }) => {
          const isOwner = profiles?.id === currentUserId;

          return (
            <div key={id}>
              <Link
                href={`/posts/${slug}`}
                className="block rounded-md border border-yellow-500 p-3 hover:bg-yellow-100"
              >
                <div className="font-semibold">{title}</div>
                <div>{content}</div>
                <div className="text-sm text-gray-600">
                  by {profiles?.username}
                </div>
                {image && <img src={image} alt="" width="100%" />}
              </Link>

              {isOwner && (
                <div className="flex space-x-2 mt-1">
                  <DeleteButton postId={id} />
                  <EditButton postId={id} initialTitle={title} />
                </div>
              )}
            </div>
          );
        })}

      {error && <p className="text-red-500">Error...</p>}
    </div>
  );
}
