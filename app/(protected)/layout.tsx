import "../globals.css";
import { QueryClientProvider } from "../../providers/provider-tanstack";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
              <div className="bg-background">{children}</div>    
            </SidebarInset>
          </SidebarProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
