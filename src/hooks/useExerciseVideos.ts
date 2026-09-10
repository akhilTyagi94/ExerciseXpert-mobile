import { useQuery } from '@tanstack/react-query';

import { fetchExerciseVideos } from '@/services/api/youtubeRepository';

export function useExerciseVideos(exerciseName: string | undefined) {
  return useQuery({
    queryKey: ['exerciseVideos', exerciseName],
    queryFn: () => fetchExerciseVideos(exerciseName!),
    enabled: Boolean(exerciseName),
  });
}
