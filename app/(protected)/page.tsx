import { createClient } from "@/utils/supabase/client";
import { getHomePosts } from "@/utils/supabase/queries";
import PostsList from "../../components/PostsList";
import { NoPostElement } from "../../components/NoPostElement";
import LoginToast from "../../components/LogInToast";

export const revalidate = 600;

export default async function Home() {
  const supabase = createClient();

  const { data: posts, error } = await getHomePosts(supabase);
  if (error) {
    console.error("Error fetching posts:", error.message);
    return (
      <p className="text-red-500">
        Failed to load posts. Please try again later.
      </p>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <>
        <LoginToast />
        <NoPostElement />
      </>
    );
  }

  return (
    <>
      <PostsList posts={posts!} />
    </>
  );
}
