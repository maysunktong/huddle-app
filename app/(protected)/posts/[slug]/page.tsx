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
    <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto h-full">
      <Card key={id} className="relative group duration-200 border-0">
        {isOwner && (
          <div className="absolute top-5 right-0 z-10">
            <CardSettingButton postId={id} initialTitle={title} />
          </div>
        )}
        <CardHeader className="flex gap-2 justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:underline text-sm font-bold rounded-full bg-[#dfdcf8] hover:bg-[#C4BCFF] p-2 cursor-pointer"
          >
            {""}
            <ArrowLeft size={24} className="text-black" />
          </button>
          <div>
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
          </div>
        </CardHeader>

        <CardContent>
          <CardTitle className="text-lg pb-6 font-semibold">{title}</CardTitle>
          {/* Images Carousel */}
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full h-auto relative"
          >
            <CarouselContent className="h-full w-full">
              {images &&
                images.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="max-h-full w-full flex justify-center items-center"
                  >
                    <img
                      src={item}
                      alt={title || `Image ${index + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-50" />
          </Carousel>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
