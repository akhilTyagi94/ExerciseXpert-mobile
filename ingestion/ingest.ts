import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

import { ExerciseDbAdapter } from './adapters/exerciseDbAdapter';
import { ExerciseDbV1Adapter } from './adapters/exerciseDbV1Adapter';
import type { CanonicalExercise, ExerciseSourceAdapter } from './adapters/types';

// Server-side-only ingestion job: run on a schedule (cron / GitHub Action /
// Supabase scheduled function), never invoked by the mobile app. Exercises
// are deduped across sources by slug (see ingestExercise below); each
// source's own idempotency is tracked separately in exercise_sources.

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

// Multiple sources can describe the same real-world exercise (e.g. "push-up"
// from both ExerciseDB and ExerciseDB v1); they're merged into one canonical
// row by slug rather than kept as near-duplicates. Each source's mapping is
// tracked separately in exercise_sources so reruns stay idempotent per
// adapter regardless of which source's row currently "owns" the exercise.
async function ingestExercise(supabase: SupabaseClient, exercise: CanonicalExercise) {
  const { data: existing } = await supabase
    .from('exercises')
    .select('id, instructions')
    .eq('slug', exercise.slug)
    .maybeSingle();

  // Prefer whichever source has richer instructions rather than letting the
  // most-recently-run adapter silently overwrite better content.
  const instructions =
    existing && existing.instructions.length >= exercise.instructions.length
      ? existing.instructions
      : exercise.instructions;

  const { data: exerciseRow, error: exerciseError } = await supabase
    .from('exercises')
    .upsert(
      {
        slug: exercise.slug,
        name: exercise.name,
        difficulty: exercise.difficulty,
        movement_pattern: exercise.movementPattern,
        instructions,
        source_provider: exercise.sourceProvider,
        source_id: exercise.sourceId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();
  if (exerciseError) throw exerciseError;
  const exerciseId = exerciseRow.id as string;

  const { error: sourceError } = await supabase
    .from('exercise_sources')
    .upsert({ exercise_id: exerciseId, source_provider: exercise.sourceProvider, source_id: exercise.sourceId });
  if (sourceError) throw sourceError;

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
      .upsert(
        { exercise_id: exerciseId, media_type: media.type, source_url: media.sourceUrl },
        { onConflict: 'exercise_id,media_type,source_url' }
      );
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
  // Node 20 has no native WebSocket; supabase-js needs one for its realtime
  // client even though ingestion never uses realtime subscriptions.
  const supabase = createClient<any>(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    realtime: { transport: WebSocket as any },
  });
  const adapters: ExerciseSourceAdapter[] = [
    new ExerciseDbAdapter(requireEnv('RAPIDAPI_KEY')),
    new ExerciseDbV1Adapter(),
  ];

  for (const adapter of adapters) {
    await runAdapter(supabase, adapter);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
