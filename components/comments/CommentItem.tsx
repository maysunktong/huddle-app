"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CommentType } from "../../schemas/zod.schemas";

interface Props {
  comment: CommentType;
  currentUserId: string | null;
  onDelete: (commentId: string) => Promise<void>;
}

export default function CommentItem({
  comment,
  currentUserId,
  onDelete,
}: Props) {
  const isDeleted = comment.content === "This comment has been deleted.";
  const canDelete = currentUserId === comment.user_id && !isDeleted;

  return (
    <div className="pl-4 border-l py-2 flex justify-between items-center gap-2">
      <p className={`text-sm ${isDeleted ? "italic opacity-60" : ""}`}>
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
  );
}
