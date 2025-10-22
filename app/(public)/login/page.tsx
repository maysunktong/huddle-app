import LogInForm from "./LogInForm";
import LogInHeroSection from "../../../components/LogInHeroSection";
import DiscoBall from "../../../components/DiscoBall";
import Logo from "../../../components/Logo";

export default function LogInPage() {
  return (
    <div>
      <div className="grid  lg:grid-cols-2 h-screen bg-sidebar-foreground">
        <div className="bg-muted relative hidden lg:block">
          <LogInHeroSection />
        </div>
        <div className="flex flex-col justify-center p-6 bg-[#C4BCFF] md:bg-sidebar-primary-foreground">
          <div className="block lg:hidden">
            <DiscoBall />
          </div>
          <div className="flex flex-col flex-1 justify-center items-center">
            <div className="w-full max-w-xs text-center">
              <div className="flex justify-center items-center gap-2 py-8">
                <Logo />
              </div>
              <LogInForm />
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-xs text-gray-500">
              © 2025 May Sunktong. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
