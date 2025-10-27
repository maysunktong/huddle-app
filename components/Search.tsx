"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { getSearchedPosts } from "../utils/supabase/queries";
import PostCard from "./PostCard";
import { Card } from "./ui/card";

export default function Search() {
  const supabase = createClient();
  const [userInput, setUserInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    getUser();
  }, [supabase]);

  const { data: searchResults } = useQuery({
    queryKey: ["search-results", searchTerm],
    queryFn: ({ signal }) =>
      getSearchedPosts(supabase, searchTerm, signal).then((res) => res.data),
    enabled: searchTerm.length > 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchTerm(userInput.trim());
    }
  };

  return (
    <div className="space-y-4">
      <input
        name="search"
        placeholder="Search by post title"
        className="border border-pink-400 p-2 w-full"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {searchResults && searchResults.length > 0 ? (
        <Card className="grid grid-cols-1 gap-6 max-w-2xl mx-auto h-full">
          {searchResults.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </Card>
      ) : searchTerm ? (
        <p>No posts found for "{searchTerm}"</p>
      ) : null}
    </div>
  );
}
