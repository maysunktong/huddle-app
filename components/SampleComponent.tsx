import { createServerClient } from "../utils/supabase/server";

export default async function SampleComponent() {
  const supabase = await createServerClient();
  const { data: posts } = await supabase.from("posts").select();
  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
