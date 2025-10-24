import { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Huddle",
  description: "Inner circle",
};

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full min-h-screen bg-gray-100">{children}</div>;
}
