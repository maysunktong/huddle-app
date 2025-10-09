"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./UpdateButton";

export default function UsersPosts() {
  const supabase = createClient();

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
          "id, title, slug, content, created_at, profiles(username), image"
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

  if (error) return <p className="text-red-500">Error loading posts</p>;
  if (!data) return <p>Loading...</p>;
  if (data.length === 0) return <p>No posts found.</p>;

  return (
    <div className="flex flex-col space-y-2">
      {data.map(({ id, title, content, slug, profiles, image}) => (
        <div key={id}>
          <Link
            href={`/posts/${slug}`}
            className="block rounded-md border border-yellow-500 p-3 hover:bg-yellow-100"
          >
            <div className="font-semibold">{title}</div>
            <div>{content}</div>
            <div className="text-sm text-gray-600">
              by {profiles?.username ?? "Unknown"}
            </div>
            {image && <img src={image} alt="" width="100" height="100" /> }
          </Link>
          <DeleteButton postId={id} />
          <EditButton postId={id} initialTitle={title} />
        </div>
      ))}
    </div>
  );
}
