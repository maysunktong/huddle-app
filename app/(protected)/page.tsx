import LoginToast from "../../components/LogInToast";
import HomePosts from "../../components/HomePosts";

export default async function Home() {
  return (
    <>
      <LoginToast />
      <HomePosts />
    </>
  );
}
