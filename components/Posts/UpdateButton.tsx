"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";
import { updatePost } from "../../utils/supabase/queries";

export function EditButton({
  postId,
  initialTitle,
}: {
  postId: string;
  initialTitle: string;
}) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await updatePost(supabase, postId, { title });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-posts"] });
      setOpen(false);
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-500 text-sm underline ml-2"
      >
        Edit
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-semibold mb-4">Edit Post Title</h2>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="px-3 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
