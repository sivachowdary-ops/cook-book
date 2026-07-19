import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is properly configured and reachable
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("products").select("count").limit(1);
    if (error) {
      console.warn("Supabase connection check warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase connection check error:", err);
    return false;
  }
}
