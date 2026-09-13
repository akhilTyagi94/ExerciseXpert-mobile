-- Supports Phase 2.5 (multi-source exercise ingestion): the `exercises` table's
-- own `unique (source_provider, source_id)` constraint assumed one source per
-- row. Once a second source can map to the same canonical exercise (matched
-- by slug), that pairing needs to live in its own table so each adapter still
-- gets idempotent reruns without fighting over which source "owns" the row.
create table exercise_sources (
  exercise_id uuid not null references exercises (id) on delete cascade,
  source_provider text not null,
  source_id text not null,
  created_at timestamptz not null default now(),
  primary key (source_provider, source_id)
);

alter table exercise_sources enable row level security;
create policy "public read" on exercise_sources for select using (true);

-- Without this, re-running ingestion for a source that's already been
-- ingested inserts a duplicate media row every time (exercise_media has no
-- natural key today, only a generated `id`).
alter table exercise_media
  add constraint exercise_media_unique_source unique (exercise_id, media_type, source_url);
