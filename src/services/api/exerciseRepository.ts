import type {
  Difficulty,
  Equipment,
  ExerciseDetail,
  ExerciseSummary,
  Muscle,
  MuscleGroupSection,
} from '@/domain/exercise';
import { mockExerciseDetail, mockExercises, mockMuscleGroups } from '@/data/mockExercises';

import { isSupabaseConfigured, supabase } from './supabase';

// Raw shapes as they come back from Supabase's nested-select embedding —
// kept local to this file since nothing outside the repository should know
// the Postgres column/table shape (see CanonicalExercise for the ingestion
// side of the same principle).
interface RawExerciseRow {
  id: string;
  slug: string;
  name: string;
  difficulty: Difficulty | null;
  instructions: string[];
  exercise_muscles: { role: 'primary' | 'secondary'; muscle_groups: { slug: string; name: string } }[];
  exercise_equipment: { equipment: { slug: string; name: string } }[];
  exercise_media: { media_type: string; cdn_url: string | null; source_url: string | null }[];
}

const EXERCISE_SELECT = `
  id, slug, name, difficulty, instructions,
  exercise_muscles ( role, muscle_groups ( slug, name ) ),
  exercise_equipment ( equipment ( slug, name ) ),
  exercise_media ( media_type, cdn_url, source_url )
`;

function toMuscles(row: RawExerciseRow): Muscle[] {
  return row.exercise_muscles.map((m) => ({
    slug: m.muscle_groups.slug,
    name: m.muscle_groups.name,
    role: m.role,
  }));
}

function toEquipment(row: RawExerciseRow): Equipment[] {
  return row.exercise_equipment.map((e) => ({ slug: e.equipment.slug, name: e.equipment.name }));
}

function toPosterUrl(row: RawExerciseRow): string {
  const media = row.exercise_media.find((m) => m.media_type === 'poster') ?? row.exercise_media[0];
  // Falls back to the original (likely hotlinked) source until the
  // transcode pipeline backfills cdn_url — see ingestion/mediaTranscode.ts.
  return media?.cdn_url ?? media?.source_url ?? '';
}

function toVideoUrl(row: RawExerciseRow): string | undefined {
  return row.exercise_media.find((m) => m.media_type === 'video')?.cdn_url ?? undefined;
}

function toSummary(row: RawExerciseRow): ExerciseSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    difficulty: row.difficulty ?? undefined,
    muscles: toMuscles(row),
    equipment: toEquipment(row),
    media: { posterUrl: toPosterUrl(row), videoUrl: toVideoUrl(row) },
  };
}

export async function fetchExercises(): Promise<ExerciseSummary[]> {
  if (!isSupabaseConfigured) return mockExercises;

  const { data, error } = await supabase!.from('exercises').select(EXERCISE_SELECT).limit(50);
  if (error) throw error;
  return (data as unknown as RawExerciseRow[]).map(toSummary);
}

export async function fetchExerciseBySlug(slug: string): Promise<ExerciseDetail | null> {
  if (!isSupabaseConfigured) return mockExerciseDetail;

  const { data, error } = await supabase!
    .from('exercises')
    .select(EXERCISE_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as RawExerciseRow;

  const { data: relatedRows, error: relatedError } = await supabase!
    .from('exercise_related')
    .select(`related_exercise_id, exercises:related_exercise_id ( ${EXERCISE_SELECT} )`)
    .eq('exercise_id', row.id)
    .limit(6);
  if (relatedError) throw relatedError;

  return {
    ...toSummary(row),
    instructions: row.instructions,
    relatedExercises: ((relatedRows ?? []) as unknown as { exercises: RawExerciseRow }[]).map((r) =>
      toSummary(r.exercises)
    ),
  };
}

export async function fetchMuscleGroupSections(): Promise<MuscleGroupSection[]> {
  if (!isSupabaseConfigured) return mockMuscleGroups;

  const { data, error } = await supabase!
    .from('muscle_group_exercise_counts')
    .select('slug, name, exercise_count')
    .order('exercise_count', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    exerciseCount: row.exercise_count,
    // The design's per-group subtitle/tags (e.g. "Push Mechanic", "Clavicular
    // & Sternal Heads") are curated copy, not derivable from the schema —
    // left blank until that content is authored.
    subtitle: '',
    tags: [],
  }));
}
