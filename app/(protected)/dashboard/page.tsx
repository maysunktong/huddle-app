"use client";
import { LogOut } from "../../../actions/log-out";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <button
        className="border p-2 bg-amber-500 cursor-pointer"
        onClick={() => LogOut()}
      >
        Log out
      </button>
    </div>
  );
}
