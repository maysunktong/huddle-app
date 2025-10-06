import PostsList from "../../components/Posts/PostsList";
import { createClient } from "../../utils/supabase/client";
import { getHomePosts } from "../../utils/supabase/queries";

export const revalidate = 600;

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await getHomePosts(supabase);
  if (error) {
    console.error("Error fetching posts:", error.message);
    return (
      <p className="text-red-500">
        Failed to load posts. Please try again later.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return <p>No posts found.</p>;
  }

  return (
    <>
      <PostsList posts={data!} />
    </>
  );
}
