"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import {
  SinglePostsType,
  getSinglePost,
} from "../../../../utils/supabase/queries";
import PostCard from "../../../../components/PostCard";
import { ArrowLeft } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { toast } from "sonner";
import { NoPostElement } from "../../../../components/NoPostElement";
import { Spinner } from "../../../../components/ui/spinner";

export default function SinglePost() {
  const [singlePost, setSinglePost] = useState<SinglePostsType | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        setCurrentUserId(user?.id ?? null);

        const { data: post, error } = await getSinglePost(supabase, slug);
        if (error) throw error;

        setSinglePost(post);
      } catch (err: any) {
        console.error("Error loading post:", err.message);
        toast.error("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [supabase, slug]);

  if (loading)
    return (
      <div className="w-full h-full py-8 flex justify-center items-center flex-1">
        <Spinner className="size-8" />
      </div>
    );
  if (!singlePost) return <NoPostElement />;

  return (
    <Card className="grid grid-cols-1 gap-6 max-w-xl mx-auto h-full p-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-12 h-12 flex justify-center items-center hover:underline font-bold rounded-full bg-[#dfdcf8] hover:bg-[#C4BCFF] cursor-pointer"
      >
        {""}
        <ArrowLeft size={24} className="text-black w-6 h-6 font-bold" />
      </button>
      <PostCard
        key={singlePost.id}
        post={singlePost}
        currentUserId={currentUserId}
        isSinglePost={true}
      />
    </Card>
  );
}
