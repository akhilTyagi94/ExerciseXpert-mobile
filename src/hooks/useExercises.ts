import { useQuery } from '@tanstack/react-query';

import {
  fetchExerciseBySlug,
  fetchExerciseCount,
  fetchExercises,
  fetchExercisesByEquipment,
  fetchExercisesByMuscle,
  fetchMuscleGroupSections,
  searchExercises,
} from '@/services/api/exerciseRepository';
import { mockExercises, mockMuscleGroups } from '@/data/mockExercises';

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
    placeholderData: mockExercises,
  });
}

export function useExerciseCount() {
  return useQuery({ queryKey: ['exerciseCount'], queryFn: fetchExerciseCount });
}

export function useSearchExercises(query: string) {
  return useQuery({
    queryKey: ['exercises', 'search', query],
    queryFn: () => searchExercises(query),
    enabled: query.trim().length > 0,
  });
}

export function useExercisesByMuscle(muscleSlug: string) {
  return useQuery({
    queryKey: ['exercises', 'muscle', muscleSlug],
    queryFn: () => fetchExercisesByMuscle(muscleSlug),
    enabled: Boolean(muscleSlug),
  });
}

export function useExercisesByEquipment(equipmentSlug: string) {
  return useQuery({
    queryKey: ['exercises', 'equipment', equipmentSlug],
    queryFn: () => fetchExercisesByEquipment(equipmentSlug),
    enabled: Boolean(equipmentSlug),
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
