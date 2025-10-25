"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";
import { MessageCircleMore, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NestedComment } from "../../schemas/zod.schemas";

interface Props {
  comment: NestedComment;
  onReply: (parentId: string, value: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export default function CommentItem({ comment, onReply, onDelete }: Props) {
  const [replying, setReplying] = useState(false);
  const isDeleted = comment.content === "This comment has been deleted.";

  return (
    <div className="space-y-2 pl-4 border-l">
      <div className="flex items-center gap-2 justify-between">
        <p className={`text-sm ${isDeleted ? "italic opacity-60" : ""}`}>
          {comment.content}
        </p>
        {!isDeleted && (
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

      {!isDeleted && (
        <Button variant="ghost" onClick={() => setReplying((p) => !p)} className="text-xs text-gray-400 hover:bg-gray-200">
          <MessageCircleMore />
          Reply
        </Button>
      )}

      {replying && !isDeleted && (
        <CommentForm
          autoFocus
          onSubmit={async (value) => {
            await onReply(comment.id, value);
            setReplying(false);
          }}
        />
      )}

      <div className="space-y-3">
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
