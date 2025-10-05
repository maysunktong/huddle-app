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
  const { data, error } = await getSinglePost(slug);

  if (!data) return <p>Post not found</p>;

  return (
    <>
      <p>{data?.title}</p>
    </>
  );
}
