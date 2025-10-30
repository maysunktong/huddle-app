"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { getHomePosts, getSearchedPosts } from "../utils/supabase/queries";
import PostCard from "./PostCard";
import { Card } from "./ui/card";
import { NoPostElement } from "./NoPostElement";
import SearchBar from "./SearchBar";

export default function HomePosts() {
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: allPosts, isLoading: allPostsLoading } = useQuery({
    queryKey: ["home-posts"],
    queryFn: () => getHomePosts(supabase).then((res) => res.data),
    enabled: !searchValue,
  });

  const { data: searchedPosts, isLoading: searchedPostsLoading } = useQuery({
    queryKey: ["searched-posts", searchValue],
    queryFn: async ({ signal }) => {
      const result = await getSearchedPosts(supabase, searchValue, signal);
      return result.data;
    },
    enabled: !!searchValue,
  });

  const posts = searchValue ? searchedPosts : allPosts;
  const isLoading = searchValue ? searchedPostsLoading : allPostsLoading;

  return (
    <div className="space-y-4 mx-auto">
      <SearchBar onSearchChange={setSearchTerm} />
      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : posts && posts.length > 0 ? (
        <Card className="grid grid-cols-1 gap-6 max-w-2xl mx-auto h-full">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </Card>
      ) : searchTerm ? (
        <NoPostElement
          title={`No post for keyword ${searchTerm}`}
          subtext="Change your search keywords"
        />
      ) : (
        <NoPostElement />
      )}
    </div>
  );
}
