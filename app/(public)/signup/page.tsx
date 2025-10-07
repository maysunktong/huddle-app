import { Spool } from "lucide-react";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div className="bg-[url(/images/hands.jpg)] bg-cover bg-center flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div className="flex w-full max-w-sm flex-col gap-6 justify-center items-center">
    <a href="#" className="flex items-center gap-2 font-medium text-3xl text-white">
      <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
        <Spool className="size-5" />
      </div>
      Huddle
    </a>
    <SignUpForm />
  </div>
</div>

  );
}
