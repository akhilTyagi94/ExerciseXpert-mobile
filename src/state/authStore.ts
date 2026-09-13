import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { isSupabaseConfigured, supabase } from '@/services/api/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>(() => ({
  session: null,
  user: null,
  // Starts false when Supabase isn't configured — there is no auth state to
  // resolve, so screens should treat that as "signed out" immediately
  // rather than waiting on a load that will never happen.
  isLoading: isSupabaseConfigured,
}));

// Called once from the root layout. Keeps the store in sync with Supabase's
// own session state rather than screens managing auth state themselves.
export function initAuthListener() {
  if (!isSupabaseConfigured) return;

  supabase!.auth.getSession().then(({ data }) => {
    useAuthStore.setState({ session: data.session, user: data.session?.user ?? null, isLoading: false });
  });

  supabase!.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({ session, user: session?.user ?? null, isLoading: false });
  });
}
