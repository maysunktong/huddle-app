"use client";
import { LogOut } from "../../../actions/log-out";

export default function AccountPage() {
  return (
    <div>
      Account Page
      <button
        className="border p-2 bg-amber-500 cursor-pointer"
        onClick={() => LogOut()}
      >
        Log out
      </button>
    </div>
  );
}
