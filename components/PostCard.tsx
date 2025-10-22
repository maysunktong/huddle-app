import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSettingButton } from "./CardSettingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCarousel from "./PostCarousel";

export default function PostCard({
  post,
  currentUserId,
  isSinglePost = false
}: {
  post: any;
  currentUserId: string | null;
  isSinglePost?: boolean
}) {
  const { id, title, content, slug, profiles, images } = post;
  const isOwner = profiles?.id === currentUserId;

  return (
    <Card key={id} className="relative group duration-200 w-full h-full">
      {isOwner && (
        <div className="absolute top-5 right-0 z-10">
          <CardSettingButton
            postId={id}
            initialTitle={title}
            initialContent={content}
          />
        </div>
      )}
      <CardHeader className="flex gap-2 justify-start items-center">
        <Avatar className="rounded-md">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt={profiles?.username || "User"}
          />
          <AvatarFallback>
            {profiles?.username?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <CardDescription className="text-sm text-muted-foreground">
          by {profiles?.username}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/posts/${slug}`}>
          <CardTitle className="text-lg pb-6 font-semibold">{title}</CardTitle>
        </Link>

        {images && <PostCarousel images={images} title={title} />}

        <Link href={`/posts/${slug}`}>
          <p className={`mt-2 text-sm ${isSinglePost ? "" : "line-clamp-3"}`}>{content}</p>
        </Link>
      </CardContent>
    </Card>
  );
}
