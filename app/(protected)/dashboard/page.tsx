"use client";

import LogOutButton from "@/components/auth-ui/LogOutButton";
import CreatePostForm from "@/components/Posts/CreatePostForm";
import UsersPosts from "@/components/posts/UsersPosts";

export default function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
      <UsersPosts />
    </div>
  );
}
