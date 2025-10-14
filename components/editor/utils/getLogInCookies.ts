"use server";

import { cookies } from "next/headers";

export async function checkLoginCookie() {
  const hasCookie = cookies().get("login_success");
  if (hasCookie) {
    // remove it right away so it doesn't trigger again
    cookies().delete("login_success");
    return true;
  }
  return false;
}
