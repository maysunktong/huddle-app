"use server";

import { cookies } from "next/headers";

export async function checkLoginCookie() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.get("login_success");
  if (hasCookie) {
    cookieStore.delete("login_success");
    return true;
  }
  return false;
}
