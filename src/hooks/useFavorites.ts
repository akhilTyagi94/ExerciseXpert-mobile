import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ExerciseSummary } from '@/domain/exercise';
import { fetchFavoriteExercises } from '@/services/api/exerciseRepository';
import { addFavorite, fetchFavoriteExerciseIds, removeFavorite } from '@/services/api/favoritesRepository';

import { useAuth } from './useAuth';

export function useFavoriteIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['favoriteIds', user?.id],
    queryFn: () => fetchFavoriteExerciseIds(user!.id),
    enabled: Boolean(user),
  });
}

export function useFavoriteExercises() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['favoriteExercises', user?.id],
    queryFn: () => fetchFavoriteExercises(user!.id),
    enabled: Boolean(user),
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exercise, isFavorited }: { exercise: ExerciseSummary; isFavorited: boolean }) => {
      if (!user) throw new Error('Sign in to save favorites.');
      if (isFavorited) {
        await removeFavorite(user.id, exercise.id);
      } else {
        await addFavorite(user.id, exercise);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteIds', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favoriteExercises', user?.id] });
    },
  });
}
