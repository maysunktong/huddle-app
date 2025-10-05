import "../globals.css";
import { QueryClientProvider } from "../../providers/provider-tanstack";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <h1>Auth Layout</h1>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
