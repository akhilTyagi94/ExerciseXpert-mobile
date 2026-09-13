import type { ExerciseSummary } from '@/domain/exercise';

import { supabase } from './supabase';

// Favorites require a signed-in user (see the RLS policy in
// 0003_accounts_and_favorites.sql) — there is no mock-data fallback here
// the way exerciseRepository has one, since this feature simply isn't
// available yet without Supabase configured and a session.

export async function fetchFavoriteExerciseIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase!.from('favorites').select('exercise_id').eq('user_id', userId);
  if (error) throw error;
  return new Set(data.map((row) => row.exercise_id));
}

export async function addFavorite(userId: string, exercise: ExerciseSummary): Promise<void> {
  const { error } = await supabase!.from('favorites').insert({ user_id: userId, exercise_id: exercise.id });
  if (error) throw error;
}

export async function removeFavorite(userId: string, exerciseId: string): Promise<void> {
  const { error } = await supabase!.from('favorites').delete().eq('user_id', userId).eq('exercise_id', exerciseId);
  if (error) throw error;
}
