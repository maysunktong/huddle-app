"use client";

import LogOutButton from "@/components/auth-ui/LogOutButton";
import CreatePostForm from "@/components/posts/CreatePost";
import UsersPosts from "@/components/posts/UsersPosts";

export default function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
      <LogOutButton />
      <CreatePostForm />
      <UsersPosts />
    </div>
  );
}
