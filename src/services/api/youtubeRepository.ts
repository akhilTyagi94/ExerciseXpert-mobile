import { isSupabaseConfigured, supabase } from './supabase';

export interface ExerciseVideo {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  channelName?: string;
}

// Calls the youtube-videos Edge Function (supabase/functions/youtube-videos)
// rather than RapidAPI directly — the RapidAPI key lives only in that
// function's environment, never in this client bundle.
export async function fetchExerciseVideos(exerciseName: string): Promise<ExerciseVideo[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase!.functions.invoke('youtube-videos', {
    body: { query: `${exerciseName} exercise tutorial` },
  });
  if (error) throw error;
  return data?.videos ?? [];
}
