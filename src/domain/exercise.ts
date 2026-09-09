// App-facing domain types, mirroring the canonical Postgres schema
// (supabase/migrations/0001_exercise_schema.sql). The app only ever talks to
// this shape — never to a third-party provider's field names — so swapping
// the backend's data source never touches this file or its consumers.

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Muscle {
  slug: string;
  name: string;
  role: 'primary' | 'secondary';
}

export interface Equipment {
  slug: string;
  name: string;
}

export interface ExerciseMedia {
  posterUrl: string;
  videoUrl?: string;
}

export interface ExerciseSummary {
  id: string;
  slug: string;
  name: string;
  difficulty?: Difficulty;
  muscles: Muscle[];
  equipment: Equipment[];
  media: ExerciseMedia;
  setsReps?: string;
}

export interface ExerciseDetail extends ExerciseSummary {
  instructions: string[];
  movementPattern?: string;
  relatedExercises: ExerciseSummary[];
}

export interface MuscleGroupSection {
  slug: string;
  name: string;
  exerciseCount: number;
  subtitle: string;
  tags: string[];
  imageUrl?: string;
}
