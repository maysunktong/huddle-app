"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import {
  SinglePostsType,
  getSinglePost,
} from "../../../../utils/supabase/queries";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "../../../../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardSettingButton } from "../../../../components/CardSettingButton";
import { ArrowLeft, Link } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "../../../../components/ui/carousel";
import PostCard from "../../../../components/PostCard";

export default function SinglePost() {
  const params = useParams();
  const slug = params?.slug as string;

  const supabase = createClient();
  const router = useRouter();

  const [post, setPost] = useState<SinglePostsType | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await getSinglePost(slug);
      if (error) {
        setError(error.message);
      } else {
        setPost(data);
      }
    };

    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setCurrentUserId(data.user?.id ?? null);
    };

    fetchPost();
    getUser();
  }, [slug, supabase]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!post) return;

  const { id, title, content, images, author_id, profiles } = post;
  const isOwner = author_id === currentUserId;

  return (
    <Card className="grid grid-cols-1 gap-6 max-w-xl mx-auto h-full">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-12 h-12 flex justify-center items-center hover:underline font-bold rounded-full bg-[#dfdcf8] hover:bg-[#C4BCFF] cursor-pointer"
      >
        {""}
        <ArrowLeft size={24} className="text-black w-6 h-6 font-bold" />
      </button>
      <PostCard key={post.id} post={post} currentUserId={currentUserId} isSinglePost={true} />
    </Card>
  );
}
