"use client";
import { LogOut } from "../../../actions/log-out";
import UsersPosts from "../../../components/Posts/UsersPosts";

export default function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
      <button
        className="border p-2 bg-amber-500 cursor-pointer"
        onClick={() => LogOut()}
      >
        Log out
      </button>
      <UsersPosts />
    </div>
  );
}
