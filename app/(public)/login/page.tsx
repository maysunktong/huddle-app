import LogInForm from "./LogInForm";
import Background from "../../../components/home/Background";
import DiscoBall from "../../../components/home/DiscoBall";
import Logo from "../../../components/Logo";

export default function LogInPage() {
  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="bg-muted relative hidden lg:block">
          <Background />
        </div>
        <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#C2D8BE] lg:bg-background">
          <div className="flex justify-center items-center gap-2">
            <Logo />
          </div>
          <div className="block lg:hidden">
            <DiscoBall />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LogInForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
