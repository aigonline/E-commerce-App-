import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not found. Using demo mode.")
}

// Create a single supabase client for server-side
export const createServerSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for demo purposes
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Create a singleton client for the browser
let clientSingleton: ReturnType<typeof createClient> | null = null

export const createBrowserSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for demo purposes
    return null
  }

  if (!clientSingleton) {
    clientSingleton = createClient(supabaseUrl, supabaseAnonKey)
  }
  return clientSingleton
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
