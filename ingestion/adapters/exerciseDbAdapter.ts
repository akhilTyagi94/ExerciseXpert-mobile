import type { CanonicalExercise, ExerciseSourceAdapter } from './types';

// The current web app's data source (see the old ExerciseXpert app's
// src/utils/fetchData.js), reused here as one ingestion source among
// several possible ones rather than a live client-side dependency. The
// RapidAPI key is only ever read in this server-side ingestion process —
// it never ships in the mobile app bundle.

const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';

interface ExerciseDbExercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  bodyPart: string;
  equipment: string;
  instructions: string[];
  secondaryMuscles: string[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export class ExerciseDbAdapter implements ExerciseSourceAdapter {
  readonly providerName = 'exercisedb';

  constructor(private readonly apiKey: string) {}

  async fetchAll(): Promise<CanonicalExercise[]> {
    const response = await fetch(`https://${RAPIDAPI_HOST}/exercises?limit=0`, {
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`ExerciseDB request failed: ${response.status} ${response.statusText}`);
    }

    const raw: ExerciseDbExercise[] = await response.json();
    return raw.map((exercise) => this.toCanonical(exercise));
  }

  private toCanonical(exercise: ExerciseDbExercise): CanonicalExercise {
    return {
      sourceProvider: this.providerName,
      sourceId: exercise.id,
      name: exercise.name,
      slug: slugify(exercise.name),
      instructions: exercise.instructions ?? [],
      muscles: [
        { slug: slugify(exercise.target), name: exercise.target, role: 'primary' },
        ...exercise.secondaryMuscles.map((muscle) => ({
          slug: slugify(muscle),
          name: muscle,
          role: 'secondary' as const,
        })),
      ],
      equipment: [{ slug: slugify(exercise.equipment), name: exercise.equipment }],
      media: [{ type: 'gif_original', sourceUrl: exercise.gifUrl }],
    };
  }
}
