"use client";

import {
  IconCancel,
  IconDotsVertical,
  IconLogout,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { PencilIcon } from "lucide-react";

export function CardSettingButton({
  postId,
  initialTitle,
}: {
  postId: string;
  initialTitle: string;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={2}
          >
            <DropdownMenuGroup>
              <div>
                <EditButton postId={postId} initialTitle={initialTitle} />
              </div>
              <DropdownMenuItem className="text-gray-500">
                <IconTrash />
                <DeleteButton postId={postId} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconX />
              Close
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
