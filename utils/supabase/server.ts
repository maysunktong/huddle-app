import { createServerClient as createServerClientSsr } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerClientSsr<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            
          }
        },
      },
    }
  )
}
