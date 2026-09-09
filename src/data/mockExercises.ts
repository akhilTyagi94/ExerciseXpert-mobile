import type { ExerciseDetail, ExerciseSummary, MuscleGroupSection } from '@/domain/exercise';

// Phase 0 mock data — placeholder posters, hand-entered from the design
// mockups (Exercise Explorer / Detail screens) so the navigation skeleton has
// something realistic to render before the ingestion pipeline is wired to a
// live Supabase project.

function poster(seed: string): string {
  return `https://picsum.photos/seed/${seed}/600/450`;
}

export const mockExercises: ExerciseSummary[] = [
  {
    id: '1',
    slug: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    difficulty: 'intermediate',
    muscles: [
      { slug: 'pectorals', name: 'Pectorals', role: 'primary' },
      { slug: 'triceps', name: 'Triceps', role: 'secondary' },
      { slug: 'anterior-deltoids', name: 'Anterior Deltoids', role: 'secondary' },
    ],
    equipment: [{ slug: 'barbell', name: 'Barbell' }],
    media: { posterUrl: poster('barbell-bench-press') },
    setsReps: '4 sets × 8-12 reps',
  },
  {
    id: '2',
    slug: 'dumbbell-hammer-curl',
    name: 'Dumbbell Hammer Curl',
    difficulty: 'beginner',
    muscles: [
      { slug: 'biceps-brachialis', name: 'Biceps & Brachialis', role: 'primary' },
      { slug: 'brachioradialis', name: 'Brachioradialis', role: 'secondary' },
      { slug: 'forearms', name: 'Forearms', role: 'secondary' },
    ],
    equipment: [{ slug: 'dumbbell', name: 'Dumbbell' }],
    media: { posterUrl: poster('dumbbell-hammer-curl') },
    setsReps: '3 sets × 12 reps',
  },
  {
    id: '3',
    slug: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    difficulty: 'advanced',
    muscles: [
      { slug: 'quads-glutes', name: 'Quads & Glutes', role: 'primary' },
      { slug: 'hamstrings', name: 'Hamstrings', role: 'secondary' },
      { slug: 'core-stabilizers', name: 'Core Stabilizers', role: 'secondary' },
    ],
    equipment: [{ slug: 'bodyweight', name: 'Bodyweight' }],
    media: { posterUrl: poster('bulgarian-split-squat') },
    setsReps: '3 sets × 10 reps / leg',
  },
  {
    id: '4',
    slug: 'cable-lat-pulldown',
    name: 'Cable Lat Pulldown',
    difficulty: 'beginner',
    muscles: [
      { slug: 'lats', name: 'Lats (Latissimus Dorsi)', role: 'primary' },
      { slug: 'rhomboids', name: 'Rhomboids', role: 'secondary' },
      { slug: 'middle-traps', name: 'Middle Traps', role: 'secondary' },
      { slug: 'biceps', name: 'Biceps', role: 'secondary' },
    ],
    equipment: [{ slug: 'cable', name: 'Cable' }],
    media: { posterUrl: poster('cable-lat-pulldown') },
    setsReps: '4 sets × 10 reps',
  },
];

export const mockExerciseDetail: ExerciseDetail = {
  ...mockExercises[0],
  instructions: [
    'Lie back flat on the bench, feet planted firmly into the floor, eyes aligned directly under the bar.',
    'Grasp the bar slightly wider than shoulder-width, retract scapula, unrack with locked arms.',
    'Inhale deeply, lower the bar smoothly in a slight arc to mid-chest level over a 2-3 second cadence.',
    'Exhale forcefully, press upward pushing the floor through your heels until arms extend.',
  ],
  movementPattern: 'Push (Horizontal)',
  relatedExercises: [
    {
      id: '5',
      slug: 'incline-dumbbell-press',
      name: 'Incline Dumbbell Press',
      muscles: [{ slug: 'upper-chest', name: 'Upper Chest', role: 'primary' }],
      equipment: [{ slug: 'dumbbell', name: 'Dumbbell' }],
      media: { posterUrl: poster('incline-dumbbell-press') },
    },
    {
      id: '6',
      slug: 'cable-chest-stretch',
      name: 'Cable Chest Stretch',
      muscles: [{ slug: 'chest-stretch', name: 'Chest Stretch', role: 'primary' }],
      equipment: [{ slug: 'cable', name: 'Cable' }],
      media: { posterUrl: poster('cable-chest-stretch') },
    },
  ],
};

export const mockMuscleGroups: MuscleGroupSection[] = [
  {
    slug: 'chest',
    name: 'Chest (Pectorals)',
    exerciseCount: 124,
    subtitle: 'Clavicular & Sternal Heads',
    tags: ['Push Mechanic', 'Compound'],
    imageUrl: poster('anatomy-chest'),
  },
  {
    slug: 'back-lats',
    name: 'Upper Back & Lats',
    exerciseCount: 98,
    subtitle: 'Latissimus Dorsi & Rhomboids',
    tags: ['Pull Mechanic', 'Width & Density'],
    imageUrl: poster('anatomy-back'),
  },
  {
    slug: 'shoulders',
    name: 'Shoulders (Deltoids)',
    exerciseCount: 86,
    subtitle: '3 Heads',
    tags: ['Push / Overhead'],
  },
  {
    slug: 'arms',
    name: 'Arms (Biceps & Triceps)',
    exerciseCount: 142,
    subtitle: 'Push & Pull Split',
    tags: ['Isolation'],
  },
  {
    slug: 'core',
    name: 'Rectus Abdominis & Obliques',
    exerciseCount: 75,
    subtitle: 'Flexion / Anti-Rotation',
    tags: ['Core Wall'],
  },
  {
    slug: 'lower-back',
    name: 'Lower Back (Erector Spinae)',
    exerciseCount: 43,
    subtitle: 'Extension & Hinge',
    tags: ['Posterior Chain'],
  },
  {
    slug: 'legs',
    name: 'Quadriceps & Hamstrings',
    exerciseCount: 110,
    subtitle: 'Anterior & Posterior Thigh',
    tags: ['Knee Flexion / Extension', 'Heavy Load'],
    imageUrl: poster('anatomy-legs'),
  },
  {
    slug: 'glutes-calves',
    name: 'Glutes & Calves',
    exerciseCount: 68,
    subtitle: 'Hip Extension / Plantarflexion',
    tags: ['Propulsion'],
  },
];
