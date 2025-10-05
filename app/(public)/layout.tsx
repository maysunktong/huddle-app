import type { Metadata } from "next";
import "../globals.css";
import { QueryClientProvider } from "../../providers/provider-tanstack";

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
          <h1>Main layout</h1>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
