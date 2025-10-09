import { Spool } from "lucide-react";

export default function Logo({ className = "text-black" }: { className?: string }) {
  return (
    <a
      href="/dashboard"
      className={`flex items-center gap-2 font-medium text-3xl ${className}`}
    >
      <div className="bg-primary text-primary-foreground flex w-8 h-8 items-center justify-center rounded-md">
        <Spool className="w-5 h-5" />
      </div>
      Huddle
    </a>
  );
}
