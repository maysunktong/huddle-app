"use client";

import UsersPosts from "@/components/UsersPosts";
import { createClient } from "../../../utils/supabase/client";
import { getUserPosts } from "../../../utils/supabase/queries";
import { NoPostElement } from "../../../components/NoPostElement";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const supabase = createClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id;
        setCurrentUserId(user?.id || null);
        if (!userId) {
          toast.error("User not logged in");
          return;
        }
        const { data: posts, error } = await getUserPosts(supabase, userId);
        if (error) throw new Error(error.message);
        setPosts(posts);
    };

    fetchPosts();
  }, [supabase]);

  if (!posts || posts.length === 0) return <NoPostElement />;

  return (
    <div>
      <UsersPosts posts={posts} />
    </div>
  );
}
