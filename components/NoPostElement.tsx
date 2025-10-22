import { ArrowUpRightIcon, Spool } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import CreatePostDialog from "./CreatePostForm";

type NoPostElementPropsTypes = {
  title: string;
  subtext: string;
};

export function NoPostElement({
  title = "No Posts Yet",
  subtext = "You haven't create any posts",
}: NoPostElementPropsTypes) {
  return (
    <Empty className="flex flex-col items-center justify-center h-[80vh] w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spool />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{subtext}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button variant="default">
            <a href="/">Go to Home</a>
          </Button>
          <CreatePostDialog text="New Post" />
        </div>
      </EmptyContent>
    </Empty>
  );
}
