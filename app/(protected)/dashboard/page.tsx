"use client";

import LogOutButton from "@/components/auth-ui/LogOutButton";
import CreatePostForm from "@/components/Posts/CreatePost";
import UsersPosts from "@/components/Posts/UsersPosts";

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
