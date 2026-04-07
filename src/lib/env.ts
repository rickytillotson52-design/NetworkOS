const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(publicSupabaseUrl && publicSupabaseAnonKey);
}

export function getSupabaseEnv() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return {
    url: publicSupabaseUrl as string,
    anonKey: publicSupabaseAnonKey as string,
  };
}
