"use client";

import UsersPosts from "@/components/UsersPosts";
import { createClient } from "../../../utils/supabase/client";
import { getUserPosts } from "../../../utils/supabase/queries";
import { NoPostElement } from "../../../components/NoPostElement";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../../../components/ui/spinner";

export default function Dashboard() {
  const supabase = createClient();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id;
        if (!userId) {
          toast.error("User not logged in");
          return;
        }
        const { data: posts, error } = await getUserPosts(supabase, userId);
        if (error) throw new Error(error.message);
        setUserPosts(posts);
      } catch (err: any) {
        console.error("Error loading post:", err.message);
        toast.error("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [supabase]);

  if (loading)
    return (
      <div className="w-full h-full py-8 flex justify-center items-center flex-1">
        <Spinner className="size-8" />
      </div>
    );

  if (!userPosts || userPosts.length === 0) return <NoPostElement />;

  return (
    <div>
      <UsersPosts posts={userPosts} />
    </div>
  );
}
