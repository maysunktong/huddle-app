"use client";

import { LogOut } from "@/actions/log-out";

export default function LogOutButton() {
  return (
    <button
      type="button"
      className="border p-2 bg-amber-500 cursor-pointer"
      onClick={() => LogOut()}
    >
      Log out
    </button>
  );
}
