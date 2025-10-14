import "../globals.css";
import { QueryClientProvider } from "../../providers/provider-tanstack";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import { ThemeProviderWrapper } from "../../providers/theme-provider";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Huddle",
  description: "Inner circle",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster />
        <ThemeProviderWrapper>
          <QueryClientProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                <div>{children}</div>
              </SidebarInset>
            </SidebarProvider>
          </QueryClientProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
