import HomePosts from "../../../components/HomePosts";
import { createClient } from "../../../utils/supabase/client";
import { getHomePosts } from "../../../utils/supabase/queries";

export default async function PostsPage() {
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
    <div>
      Posts Page
      <HomePosts posts={data!} />
    </div>
  );
}
