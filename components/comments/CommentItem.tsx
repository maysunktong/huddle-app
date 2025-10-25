"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";
import { NestedComment } from "../../schemas/zod.schemas";

interface Props {
  comment: NestedComment;
  onReply: (parentId: string, value: string) => Promise<void>;
}

export default function CommentItem({ comment, onReply }: Props) {
  const [replying, setReplying] = useState(false);

  return (
    <div className="space-y-2 pl-4 border-l">
      <p className="text-sm">{comment.content}</p>

      <button
        onClick={() => setReplying((p) => !p)}
        className="text-xs text-blue-500 hover:underline"
      >
        Reply
      </button>

      {replying && (
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
          <CommentItem key={reply.id} comment={reply} onReply={onReply} />
        ))}
      </div>
    </div>
  );
}
