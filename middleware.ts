import { createServerClient } from "@supabase/ssr";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  /* Protected Route */
  const protectedRoutes = [/^\/$/, /^\/account/, /^\/dashboard/,/^\/posts/,];

  if (!user && protectedRoutes.some(route => route.test(request.nextUrl.pathname))) {
    const newrUrl: NextURL = request.nextUrl.clone();
    newrUrl.pathname = '/login';

    return NextResponse.redirect(newrUrl);
  }
  return supabaseResponse;
};
