import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CardSettingButton } from "./CardSettingButton";
import PostCarousel from "./PostCarousel";
import { createClient } from "../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getCommentCount } from "../utils/supabase/queries";
import { MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import UserProfile from "./UserProfile";

export default function PostCard({
  post,
  currentUserId,
  isSinglePost = false,
}: {
  post: any;
  currentUserId: string | null;
  isSinglePost?: boolean;
}) {
  const { id, title, content, slug, profiles, images } = post;
  const isOwner = profiles?.id === currentUserId;

  const supabase = createClient();
  const { data: commentCount } = useQuery({
    queryKey: ["commentCount", id],
    queryFn: () => getCommentCount(supabase, id),
  });

  return (
    <>
      <Card
        key={id}
        className="relative group duration-200 w-full h-full bg-background"
      >
        {isOwner && (
          <div className="absolute -top-5 right-0 z-10">
            <CardSettingButton
              postId={id}
              initialTitle={title}
              initialContent={content}
            />
          </div>
        )}
        <UserProfile />
        <CardContent>
          <Link href={`/posts/${slug}`}>
            <CardTitle className="text-lg font-semibold px-4 md:px-0">
              {title}
            </CardTitle>
          </Link>
          {images && <PostCarousel images={images} title={title} />}
          <Link href={`/posts/${slug}`}>
            <div className="flex items-center gap-2 mt-2 px-4 md:px-0">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 text-xs font-medium py-2 px-3 border bg-muted"
              >
                <MessageSquare size={12} strokeWidth={2} />
                {commentCount ?? 0} comments
              </Badge>
            </div>
            <p
              className={`text-sm my-4 px-4 md:px-0 ${
                isSinglePost ? "" : "line-clamp-3"
              }`}
            >
              {content}
            </p>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
