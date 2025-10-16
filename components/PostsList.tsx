"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomePostsType, getHomePosts } from "../utils/supabase/queries";
import { createClient } from "../utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSettingButton } from "./CardSettingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

export default function PostsList({ posts }: { posts: HomePostsType }) {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
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
    <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
      {data &&
        data.map(({ id, title, content, slug, profiles, images }) => {
          const isOwner = profiles?.id === currentUserId;

          return (
            <Card key={id} className="relative group duration-200 border-0">
              {isOwner && (
                <div className="absolute top-5 right-0 z-10">
                  <CardSettingButton postId={id} initialTitle={title} />
                </div>
              )}
              <CardHeader className="flex gap-2 justify-start items-center">
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
              </CardHeader>

              <CardContent>
                <Link href={`/posts/${slug}`}>
                  <CardTitle className="text-lg pb-6 font-semibold">
                    {title}
                  </CardTitle>
                </Link>
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
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      {error && (
        <p className="text-red-500 text-center col-span-full">
          Error loading posts...
        </p>
      )}
    </div>
  );
}
