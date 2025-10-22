import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "lucide-react";
import { title } from "process";
import { id } from "zod/v4/locales";
import { CardSettingButton } from "./CardSettingButton";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";

export default function PostCard() {
  return (
    <div>
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
            <CarouselContent>
              {images &&
                images.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="w-full h-[400px] md:h-[550px]"
                  >
                    <img
                      src={item}
                      alt={title || `Image ${index + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            {images && images.length > 1 && (
              <CarouselNext className="absolute top-1/2 right-1 transform -translate-y-1/2 z-50" />
            )}
          </Carousel>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
