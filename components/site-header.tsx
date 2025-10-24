"use client";

import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";
import CreatePostForm from "./CreatePostForm";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) pt-12 pb-8 md:p-0">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="block md:hidden">
          <Logo />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CreatePostForm />
        </div>
      </div>
    </header>
  );
}
