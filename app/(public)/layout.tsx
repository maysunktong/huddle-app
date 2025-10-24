import type { Metadata } from "next";
import "../globals.css";
import { QueryClientProvider } from "../../providers/provider-tanstack";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Huddle",
  description: "Inner circle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <Toaster />
          <div>{children}</div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
