import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.DrdZTVKHvVSgJsJWciIIOyq91lJodQAzUTZ8FCTV7h4";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
