import { createClient } from "@supabase/supabase-js";

// Provide fallback values for development
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.fake-key";

// Log Supabase configuration for debugging
console.log("Supabase URL:", supabaseUrl);
console.log("Using production environment:", import.meta.env.PROD);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
