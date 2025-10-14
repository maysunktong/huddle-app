import Logo from "../../../components/Logo";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div className="bg-[url(https://res.cloudinary.com/dpgdy4ayz/image/upload/v1760476090/hands_xmnsl6.jpg)] bg-cover bg-center flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 justify-center items-center">
        <Logo className="text-white" />
        <SignUpForm />
      </div>
    </div>
  );
}
