import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// True once a real project exists — until then, repositories fall back to
// mock data instead of trying (and failing) to hit a placeholder URL. This
// is an expected, first-class state during early development, not an error.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// The exercise tables are public-read (see the RLS policies in
// supabase/migrations/0001_exercise_schema.sql), so the app queries
// Postgres directly with the anon key — no custom API layer needed for
// reads. A service-role key is never used here or shipped in the app.
//
// Sessions persist via AsyncStorage — Supabase's own documented adapter for
// React Native. (expo-secure-store was considered but its ~2048-byte
// per-item limit on iOS can be exceeded by a full session object.)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
