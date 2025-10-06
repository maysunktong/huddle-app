"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";

export default function UsersPosts() {
  const supabase = createClient();

  const { data, error } = useQuery({
    queryKey: ["users-posts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, created_at, profiles(username)")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    refetchOnMount: true,
    refetchInterval: 10000,
  });

  if (error) return <p className="text-red-500">Error loading posts</p>;
  if (!data) return <p>Loading...</p>;
  if (data.length === 0) return <p>No posts found.</p>;

  return (
    <div className="flex flex-col space-y-2">
      {data.map(({ id, title, slug, profiles }) => (
        <Link
          key={id}
          href={`/posts/${slug}`}
          className="block rounded-md border border-yellow-500 p-3 hover:bg-yellow-100"
        >
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-600">
            by {profiles?.username ?? "Unknown"}
          </div>
        </Link>
      ))}
    </div>
  );
}
