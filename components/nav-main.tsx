"use client";

import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";  
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="w-full gap-4">
        {/* Dynamic Items */}
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "flex items-center gap-2 duration-200 ease-linear cursor-pointer",
                      isActive
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "text-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="w-6 h-6" />}
                    <span className="text-md">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
