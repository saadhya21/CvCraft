import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key')

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function isSupabaseConfigured(): boolean {
  return isConfigured
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) throw error
  return data
}

export async function signInWithGithub() {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}
