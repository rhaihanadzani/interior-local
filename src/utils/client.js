import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tjcbbulrshuvwjngicvq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY2JidWxyc2h1dndqbmdpY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mzc1NjAsImV4cCI6MjA2NTExMzU2MH0.D-BbReKDIDAVIy6_pXRBkoIxxLf5QI4YdsRmzu02Mls";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
