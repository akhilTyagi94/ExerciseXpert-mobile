import { useMemo } from 'react';

import { isSupabaseConfigured, supabase } from '@/services/api/supabase';
import { useAuthStore } from '@/state/authStore';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isSignedIn: session !== null,
      isLoading,

      async signUp(email: string, password: string) {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet.');
        const { error } = await supabase!.auth.signUp({ email, password });
        if (error) throw error;
      },

      async signIn(email: string, password: string) {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured yet.');
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },

      async signOut() {
        if (!isSupabaseConfigured) return;
        await supabase!.auth.signOut();
      },
    }),
    [session, isLoading]
  );
}
