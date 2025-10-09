import LogInForm from "./LogInForm";
import LogInHeroSection from "../../../components/home/LogInHeroSection";
import DiscoBall from "../../../components/home/DiscoBall";
import Logo from "../../../components/Logo";

export default function LogInPage() {
  return (
    <div>
      <div className="grid  lg:grid-cols-2 h-screen bg-sidebar-foreground">
        <div className="bg-muted relative hidden lg:block">
          <LogInHeroSection />
        </div>
        <div className="flex flex-col justify-center p-6 bg-[#C2D8BE] lg:bg-sidebar-primary-foreground">
          <div className="block lg:hidden">
            <DiscoBall />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-xs text-center">
              <div className="flex justify-center items-center gap-2 py-8">
                <Logo />
              </div>
              <LogInForm />
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-xs text-gray-500">
              Copyright 2025 May Sunktong
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
