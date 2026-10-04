export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/**
 * Uden Supabase-nøgler kører sitet i demo-tilstand: alle apps kan åbnes uden
 * login, og favoritter gemmes kun i browseren. Praktisk til lokal udvikling.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
