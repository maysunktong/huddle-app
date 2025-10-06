import {
  SinglePostsType,
  getSinglePost,
} from "../../../../utils/supabase/queries";

export default async function SinglePost({
  params,
}: {
  params: SinglePostsType;
}) {
  const { slug } = params;
  const { data: post, error } = await getSinglePost(slug);

  if (!post) return <p>Post not found</p>;

  return (
    <>
      <p>{post?.title}</p>
    </>
  );
}
