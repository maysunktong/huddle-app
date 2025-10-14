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

export function NoPostElement() {
  return (
    <Empty className="flex flex-col items-center justify-center h-[80vh] w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spool />
        </EmptyMedia>
        <EmptyTitle>No Posts Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any posts yet.
        </EmptyDescription>
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
