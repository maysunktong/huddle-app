"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
import { CardSettingButton } from "../../../../components/buttons/CardSettingButton";
import { ArrowLeft, ArrowLeftCircle } from "lucide-react";
import router from "next/router";

export default function SinglePost() {
  const params = useParams();
  const slug = params?.slug as string;

  const supabase = createClient();
  const [post, setPost] = useState<SinglePostsType | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
    };

    fetchPost();
    getUser();
  }, [slug, supabase]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!post) return <p className="text-center">Loading...</p>;

  const { id, title, content, image, profiles } = post;
  const isOwner = profiles?.id === currentUserId;

  return (
    <div className="flex justify-center p-6">
      <Card className="relative max-w-2xl w-full border-0">
        {isOwner && (
          <div className="absolute top-3 right-3 z-10">
            <CardSettingButton postId={id} initialTitle={title} />
          </div>
        )}
        <CardHeader className="flex gap-2 justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:underline text-sm font-bold rounded-full bg-[#dfdcf8] hover:bg-[#C4BCFF]  p-2"
          >
            {""}
            <ArrowLeft size={24} className="text-black" />
          </button>
          <div className="flex gap-2">
            <Avatar className="rounded-md">
              <AvatarImage
                src={
                  profiles?.avatar_url || "https://github.com/evilrabbit.png"
                }
                alt={profiles?.username || "User"}
              />
              <AvatarFallback>
                {profiles?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <CardDescription className="text-sm text-muted-foreground flex justify-center items-center">
              by {profiles?.username || "Unknown"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <CardTitle className="text-3xl pb-6 font-semibold">{title}</CardTitle>

          {image && (
            <div className="px-2">
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-cover rounded-md border"
              />
            </div>
          )}

          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
            {content}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
