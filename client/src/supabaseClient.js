import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ignsoqmwbnjyfxniivaj.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbnNvcW13Ym5qeWZ4bmlpdmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzI2ODgsImV4cCI6MjA3OTEwODY4OH0.tC5EOiPrjH6MqHCYnNabH6iL1hD4-oMSaAhfYq7JK8c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
