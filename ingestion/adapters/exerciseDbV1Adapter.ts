import type { CanonicalExercise, ExerciseSourceAdapter } from './types';

// The free, self-hosted successor to RapidAPI's ExerciseDB (see
// https://oss.exercisedb.dev/docs) — 1,500 exercises, no API key, no rate
// limit documented. Kept as a separate adapter from exerciseDbAdapter.ts
// (the original RapidAPI source) rather than replacing it, per the adapter
// pattern: both run in ingest.ts and get merged by name downstream.

const BASE_URL = 'https://oss.exercisedb.dev/api/v1/exercises';
const PAGE_SIZE = 100;

interface ExerciseDbV1Exercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  bodyParts: string[];
  equipments: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

interface ExerciseDbV1Response {
  meta: { hasNextPage: boolean; nextCursor: string | null };
  data: ExerciseDbV1Exercise[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The free tier enforces an undocumented rate limit — pulling all ~15 pages
// back-to-back reliably triggers a 429 partway through. Retries with backoff
// rather than failing the whole ingestion run over a transient throttle.
async function fetchWithRetry(url: URL, maxAttempts = 5): Promise<Response> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url);
    if (response.status !== 429) return response;
    if (attempt === maxAttempts) return response;
    const retryAfterSeconds = Number(response.headers.get('retry-after'));
    const delayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : attempt * 2000;
    await sleep(delayMs);
  }
  throw new Error('unreachable');
}

export class ExerciseDbV1Adapter implements ExerciseSourceAdapter {
  readonly providerName = 'exercisedb-v1';

  async fetchAll(): Promise<CanonicalExercise[]> {
    const results: CanonicalExercise[] = [];
    let cursor: string | undefined;

    while (true) {
      const url = new URL(BASE_URL);
      url.searchParams.set('limit', String(PAGE_SIZE));
      if (cursor) url.searchParams.set('after', cursor);

      const response = await fetchWithRetry(url);
      if (!response.ok) {
        throw new Error(`ExerciseDB v1 request failed: ${response.status} ${response.statusText}`);
      }

      const page: ExerciseDbV1Response = await response.json();
      results.push(...page.data.map((exercise) => this.toCanonical(exercise)));

      if (!page.meta.hasNextPage || !page.meta.nextCursor) break;
      cursor = page.meta.nextCursor;
      await sleep(500);
    }

    return results;
  }

  private toCanonical(exercise: ExerciseDbV1Exercise): CanonicalExercise {
    const [primaryMuscle, ...restMuscles] = exercise.targetMuscles;
    return {
      sourceProvider: this.providerName,
      sourceId: exercise.exerciseId,
      name: exercise.name,
      slug: slugify(exercise.name),
      instructions: exercise.instructions ?? [],
      muscles: [
        ...(primaryMuscle ? [{ slug: slugify(primaryMuscle), name: primaryMuscle, role: 'primary' as const }] : []),
        ...restMuscles.map((muscle) => ({ slug: slugify(muscle), name: muscle, role: 'secondary' as const })),
        ...exercise.secondaryMuscles.map((muscle) => ({
          slug: slugify(muscle),
          name: muscle,
          role: 'secondary' as const,
        })),
      ],
      equipment: exercise.equipments.map((equipment) => ({ slug: slugify(equipment), name: equipment })),
      media: [{ type: 'gif_original', sourceUrl: exercise.gifUrl }],
    };
  }
}
