import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoiYW5vbiJ9.UJ88kS70JA5FMx4ZqbcINloDWOlcjimq7VC924N3BY8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
