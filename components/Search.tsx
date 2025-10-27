"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { getHomePosts, getSearchedPosts } from "../utils/supabase/queries";
import PostCard from "./PostCard";
import { Card } from "./ui/card";
import { NoPostElement } from "./NoPostElement";

export default function HomePosts() {
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

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["home-posts"],
    queryFn: () => getHomePosts(supabase).then((res) => res.data),
  });

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

  if (postsLoading) return <p>Loading posts...</p>;

  const visiblePosts = searchTerm ? searchResults : posts;

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

      {visiblePosts && visiblePosts.length > 0 ? (
        <Card className="grid grid-cols-1 gap-6 max-w-2xl mx-auto h-full">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </Card>
      ) : searchTerm ? (
       <NoPostElement title={`No post for keyword ${searchTerm}`} subtext="Change your search keywords" />
      ) : (
        <NoPostElement />
      )}
    </div>
  );
}
