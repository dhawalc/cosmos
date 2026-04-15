import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!_client) _client = createClient(url, key);
  return _client;
}

export type Profile = {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  birth_time: string | null;
  birth_place: string | null;
  birth_time_known: boolean;
  signature: Record<string, unknown> | null;
  life_path: number | null;
  expression: number | null;
  soul_urge: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
