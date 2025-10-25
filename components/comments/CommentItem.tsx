"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CommentType } from "../../schemas/zod.schemas";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardDescription, Card, CardContent } from "../ui/card";

interface Props {
  comment: CommentType;
  currentUserId: string | null;
  postOwnerId: string;
  onDelete: (commentId: string) => Promise<void>;
}

export default function CommentItem({
  comment,
  currentUserId,
  postOwnerId,
  onDelete,
}: Props) {
  const isDeleted = comment.content === "This comment has been deleted.";
  const canDelete =
    currentUserId &&
    !isDeleted &&
    (currentUserId === comment.user_id || currentUserId === postOwnerId);

  return (
    <Card className="p-4 w-full">
      <CardHeader className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {comment.profile?.username.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold">
          {comment.profile?.username || "Unknown"}
        </span>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-[1fr_auto] items-start gap-2">
          <p
            className={`text-sm break-words whitespace-pre-wrap w-xs md:w-2xl ${
              isDeleted ? "italic opacity-60" : ""
            }`}
          >
            {comment.content}
          </p>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-red-500"
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
