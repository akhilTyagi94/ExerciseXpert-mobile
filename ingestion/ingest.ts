import { createClient } from '@supabase/supabase-js';

import { ExerciseDbAdapter } from './adapters/exerciseDbAdapter';
import type { CanonicalExercise, ExerciseSourceAdapter } from './adapters/types';

// Server-side-only ingestion job: run on a schedule (cron / GitHub Action /
// Supabase scheduled function), never invoked by the mobile app. Upserts
// every adapter's exercises into the canonical schema by
// (source_provider, source_id), so re-running is idempotent.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

type SupabaseClient = ReturnType<typeof createClient<any>>;

async function upsertMuscleGroup(supabase: SupabaseClient, slug: string, name: string) {
  const { data, error } = await supabase
    .from('muscle_groups')
    .upsert({ slug, name }, { onConflict: 'slug' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

async function upsertEquipment(supabase: SupabaseClient, slug: string, name: string) {
  const { data, error } = await supabase
    .from('equipment')
    .upsert({ slug, name }, { onConflict: 'slug' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

async function ingestExercise(supabase: SupabaseClient, exercise: CanonicalExercise) {
  const { data: exerciseRow, error: exerciseError } = await supabase
    .from('exercises')
    .upsert(
      {
        slug: exercise.slug,
        name: exercise.name,
        difficulty: exercise.difficulty,
        movement_pattern: exercise.movementPattern,
        instructions: exercise.instructions,
        source_provider: exercise.sourceProvider,
        source_id: exercise.sourceId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source_provider,source_id' }
    )
    .select('id')
    .single();
  if (exerciseError) throw exerciseError;
  const exerciseId = exerciseRow.id as string;

  for (const muscle of exercise.muscles) {
    const muscleGroupId = await upsertMuscleGroup(supabase, muscle.slug, muscle.name);
    const { error } = await supabase
      .from('exercise_muscles')
      .upsert({ exercise_id: exerciseId, muscle_group_id: muscleGroupId, role: muscle.role });
    if (error) throw error;
  }

  for (const item of exercise.equipment) {
    const equipmentId = await upsertEquipment(supabase, item.slug, item.name);
    const { error } = await supabase
      .from('exercise_equipment')
      .upsert({ exercise_id: exerciseId, equipment_id: equipmentId });
    if (error) throw error;
  }

  // Media is stored pointing at the original source for now; the transcode
  // pipeline (see mediaTranscode.ts) is a separate, not-yet-scheduled step
  // that will backfill cdn_url once Cloudflare R2 credentials are set up.
  for (const media of exercise.media) {
    const { error } = await supabase
      .from('exercise_media')
      .upsert({ exercise_id: exerciseId, media_type: media.type, source_url: media.sourceUrl });
    if (error) throw error;
  }
}

async function runAdapter(supabase: SupabaseClient, adapter: ExerciseSourceAdapter) {
  const exercises = await adapter.fetchAll();
  console.log(`[${adapter.providerName}] fetched ${exercises.length} exercises`);
  for (const exercise of exercises) {
    await ingestExercise(supabase, exercise);
  }
  console.log(`[${adapter.providerName}] ingestion complete`);
}

async function main() {
  const supabase = createClient<any>(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'));
  const adapters: ExerciseSourceAdapter[] = [new ExerciseDbAdapter(requireEnv('RAPIDAPI_KEY'))];

  for (const adapter of adapters) {
    await runAdapter(supabase, adapter);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
