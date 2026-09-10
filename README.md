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
- `src/services/api/` — Supabase client, repositories (`exerciseRepository`,
  `youtubeRepository`) mapping raw rows into domain types, and the shared
  TanStack Query client. Repositories fall back to `src/data/mockExercises.ts`
  automatically when `EXPO_PUBLIC_SUPABASE_URL`/`_ANON_KEY` aren't set, so the
  app stays usable before the backend exists.
- `src/hooks/` — TanStack Query hooks (`useExercises`, `useExercise`,
  `useMuscleGroups`, `useExerciseVideos`) that screens call instead of
  touching the repositories or mock data directly.
- `supabase/migrations/` — the canonical exercise schema (Postgres) plus a
  `muscle_group_exercise_counts` view backing the Targets tab.
- `supabase/functions/youtube-videos/` — Edge Function proxying RapidAPI's
  YouTube search so that key never ships in the app bundle.
- `ingestion/` — server-side-only scripts. Never imported by the app.

## Wiring up the backend

1. Create a Supabase project (supabase.com/dashboard → New Project).
2. Project Settings → API → copy the **Project URL**, **anon/public key**,
   and **service_role/secret key**.
3. SQL Editor → run `supabase/migrations/0001_exercise_schema.sql`, then
   `0002_muscle_group_counts.sql`, in order.
4. Copy `.env.example` to `.env` and fill in `EXPO_PUBLIC_SUPABASE_URL` /
   `EXPO_PUBLIC_SUPABASE_ANON_KEY` (read by the app) and `SUPABASE_URL` /
   `SUPABASE_SERVICE_ROLE_KEY` (read only by the ingestion script below).
   Restart `expo start` after editing `.env` — Expo only reads
   `EXPO_PUBLIC_*` vars at bundler startup.
5. Sign up at rapidapi.com, subscribe to the "ExerciseDB" API (free tier
   exists), copy your key into `.env` as `RAPIDAPI_KEY`.
6. Run the ingestion job: `npx tsx --env-file=.env ingestion/ingest.ts`. This
   populates `exercises`/`muscle_groups`/`equipment`/`exercise_media` from
   ExerciseDB. Media still points at ExerciseDB's hotlinked GIFs at this
   point — `ingestion/mediaTranscode.ts` has the transcode-to-CDN pipeline
   stubbed out, pending Cloudflare R2 credentials.
7. Deploy the YouTube proxy: `supabase functions deploy youtube-videos`, then
   `supabase secrets set RAPIDAPI_KEY=<your key>` (both require
   `supabase link` to your project first, which needs a personal access
   token from supabase.com/dashboard/account/tokens — a CLI login step, not
   something to paste into chat).

Until steps 1-4 are done, the app runs entirely on `src/data/mockExercises.ts`
— nothing is broken, there's just no live data yet.
