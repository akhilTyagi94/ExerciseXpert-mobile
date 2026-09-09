-- Canonical exercise domain schema.
-- Owned by ExerciseXpert, populated by server-side ingestion adapters (see /ingestion).
-- The mobile app and its API layer only ever read from these tables — never from a
-- third-party exercise API directly — so swapping/adding a data source never requires
-- a client change (see architecture proposal, section 6).

create extension if not exists "pgcrypto";

-- Lookup tables -------------------------------------------------------------

create table muscle_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table equipment (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

-- Core exercise table ---------------------------------------------------------

create table exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  movement_pattern text,
  instructions text[] not null default '{}',
  -- ingestion provenance: which adapter produced this row and its id in that
  -- source, so ingestion upserts are idempotent and a row's origin is traceable.
  source_provider text not null,
  source_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_provider, source_id)
);

create index exercises_slug_idx on exercises (slug);

-- Many-to-many joins ----------------------------------------------------------

create table exercise_muscles (
  exercise_id uuid not null references exercises (id) on delete cascade,
  muscle_group_id uuid not null references muscle_groups (id) on delete cascade,
  role text not null check (role in ('primary', 'secondary')),
  primary key (exercise_id, muscle_group_id)
);

create table exercise_equipment (
  exercise_id uuid not null references exercises (id) on delete cascade,
  equipment_id uuid not null references equipment (id) on delete cascade,
  primary key (exercise_id, equipment_id)
);

create table exercise_categories (
  exercise_id uuid not null references exercises (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  primary key (exercise_id, category_id)
);

-- Self-referential relation table, replacing the web app's live
-- "similar exercises" queries (same target muscle / same equipment) with a
-- precomputed table that can also hold manually curated alternatives.
create table exercise_related (
  exercise_id uuid not null references exercises (id) on delete cascade,
  related_exercise_id uuid not null references exercises (id) on delete cascade,
  relation_type text not null check (relation_type in ('same_muscle', 'same_equipment', 'alternative', 'curated')),
  primary key (exercise_id, related_exercise_id, relation_type),
  check (exercise_id <> related_exercise_id)
);

-- Media -------------------------------------------------------------------------

-- Populated by the ingestion pipeline's transcode step: original hotlinked
-- media is mirrored and converted into CDN-hosted assets (see
-- ingestion/mediaTranscode.ts) rather than served live from a third party.
create table exercise_media (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises (id) on delete cascade,
  media_type text not null check (media_type in ('poster', 'video', 'gif_original')),
  cdn_url text,
  source_url text,
  created_at timestamptz not null default now()
);

create index exercise_media_exercise_id_idx on exercise_media (exercise_id);

-- Row-level security ------------------------------------------------------------
-- This is public reference data: anyone (including unauthenticated/guest
-- browsing) can read it. Writes are performed only by the ingestion job using
-- the service role key, which bypasses RLS — no write policies are defined.

alter table muscle_groups enable row level security;
alter table equipment enable row level security;
alter table categories enable row level security;
alter table exercises enable row level security;
alter table exercise_muscles enable row level security;
alter table exercise_equipment enable row level security;
alter table exercise_categories enable row level security;
alter table exercise_related enable row level security;
alter table exercise_media enable row level security;

create policy "public read" on muscle_groups for select using (true);
create policy "public read" on equipment for select using (true);
create policy "public read" on categories for select using (true);
create policy "public read" on exercises for select using (true);
create policy "public read" on exercise_muscles for select using (true);
create policy "public read" on exercise_equipment for select using (true);
create policy "public read" on exercise_categories for select using (true);
create policy "public read" on exercise_related for select using (true);
create policy "public read" on exercise_media for select using (true);
