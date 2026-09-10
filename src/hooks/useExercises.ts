import { useQuery } from '@tanstack/react-query';

import { fetchExerciseBySlug, fetchExercises, fetchMuscleGroupSections } from '@/services/api/exerciseRepository';
import { mockExercises, mockMuscleGroups } from '@/data/mockExercises';

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
    placeholderData: mockExercises,
  });
}

export function useExercise(slug: string) {
  return useQuery({
    queryKey: ['exercise', slug],
    queryFn: () => fetchExerciseBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useMuscleGroups() {
  return useQuery({
    queryKey: ['muscleGroups'],
    queryFn: fetchMuscleGroupSections,
    placeholderData: mockMuscleGroups,
  });
}
