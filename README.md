# ExerciseXpert (mobile)

React Native / Expo rebuild of ExerciseXpert. See the architecture proposal at
`~/.claude/plans/let-s-switch-to-exercisexpert-cached-token.md` for the full
rationale behind the stack, data model, and monetization design.

## Run the app

```bash
npm install
npx expo start
```

Open in an iOS simulator, Android emulator, or a development build (this app
uses native modules — Tamagui, native tabs — so Expo Go is not supported).

## Project layout

- `src/app/` — Expo Router screens: `(tabs)/` for the 4-tab bottom nav
  (Explore, Targets, Routines, Favorites), `exercise/[slug].tsx` for the
  exercise detail stack screen, `profile.tsx` as a modal.
- `src/design-system/` — Tamagui config and tokens mapped directly from
  `designs/ExerciseXpert Design/design_system.md`, plus shared primitives
  (Card, Pill, PrimaryButton, ExerciseCard).
- `src/domain/` — canonical app-facing types, mirroring the Postgres schema.
- `src/data/mockExercises.ts` — placeholder data backing every screen until
  the API layer below is wired up.
- `supabase/migrations/` — the canonical exercise schema (Postgres).
- `ingestion/` — server-side-only scripts. Never imported by the app.

## Wiring up the backend (not yet done)

1. Create a Supabase project, then run `supabase/migrations/0001_exercise_schema.sql`
   against it (via the Supabase SQL editor or the CLI).
2. Copy `.env.example` to `.env` and fill in `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `RAPIDAPI_KEY` (the same RapidAPI key the
   old web app used).
3. Run the ingestion job: `npx tsx --env-file=.env ingestion/ingest.ts`. This populates
   `exercises`/`muscle_groups`/`equipment`/`exercise_media` from ExerciseDB.
   Media still points at ExerciseDB's hotlinked GIFs at this point —
   `ingestion/mediaTranscode.ts` has the transcode-to-CDN pipeline stubbed
   out, pending Cloudflare R2 credentials.
4. The app itself still reads from `src/data/mockExercises.ts`. Swapping it
   for real Supabase reads (via TanStack Query) is the next phase of work,
   once the schema above has real data in it.
