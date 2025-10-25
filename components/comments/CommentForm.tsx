"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (content: string) => Promise<void>;
  autoFocus?: boolean;
}

export default function CommentForm({ onSubmit, autoFocus }: Props) {
  const [content, setContent] = useState("");

  return (
    <div className="space-y-2">
      <Textarea
        autoFocus={autoFocus}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px]"
      />
      <Button
        disabled={!content.trim()}
        onClick={async () => {
          await onSubmit(content);
          setContent("");
        }}
      >
        Submit
      </Button>
    </div>
  );
}
