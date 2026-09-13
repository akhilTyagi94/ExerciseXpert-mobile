-- Phase 2: accounts + saved state. Auth itself is Supabase's built-in
-- `auth.users` table — nothing to create for that. Everything here is
-- user-owned data, scoped by RLS to auth.uid() rather than the public-read
-- policy used for the exercise domain in 0001/0002.

create table favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

-- Schema only for now — no builder UI yet (that's Phase 4). Creating the
-- tables now means Phase 4 adds screens against an existing shape rather
-- than needing its own migration later.
create table saved_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table saved_workout_exercises (
  saved_workout_id uuid not null references saved_workouts (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete cascade,
  position integer not null,
  primary key (saved_workout_id, exercise_id)
);

create table workout_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete cascade,
  completed_at timestamptz not null default now(),
  sets integer,
  reps integer,
  weight_kg numeric
);

create index favorites_user_id_idx on favorites (user_id);
create index saved_workouts_user_id_idx on saved_workouts (user_id);
create index workout_history_user_id_idx on workout_history (user_id);

alter table favorites enable row level security;
alter table saved_workouts enable row level security;
alter table saved_workout_exercises enable row level security;
alter table workout_history enable row level security;

create policy "own favorites" on favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own saved workouts" on saved_workouts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- saved_workout_exercises has no user_id column of its own — ownership is
-- checked via the parent saved_workouts row.
create policy "own saved workout exercises" on saved_workout_exercises for all
  using (exists (
    select 1 from saved_workouts
    where saved_workouts.id = saved_workout_exercises.saved_workout_id
    and saved_workouts.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from saved_workouts
    where saved_workouts.id = saved_workout_exercises.saved_workout_id
    and saved_workouts.user_id = auth.uid()
  ));

create policy "own workout history" on workout_history for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
