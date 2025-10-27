import LoginToast from "../../components/LogInToast";
import HomePosts from "../../components/Search";

export default async function Home() {
  return (
    <>
      <LoginToast />
      <HomePosts />
    </>
  );
}
