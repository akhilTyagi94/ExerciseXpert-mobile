// Canonical shape every exercise data source is normalized into before it
// touches Postgres. Adapters translate a provider's own field names/ids into
// this shape — the ingestion job and the database schema never see a
// provider-specific format directly, so a new source is a new adapter, not a
// schema or app change.

export interface CanonicalMuscle {
  slug: string;
  name: string;
  role: 'primary' | 'secondary';
}

export interface CanonicalEquipment {
  slug: string;
  name: string;
}

export interface CanonicalMedia {
  type: 'poster' | 'video' | 'gif_original';
  sourceUrl: string;
}

export interface CanonicalExercise {
  sourceProvider: string;
  sourceId: string;
  name: string;
  slug: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  movementPattern?: string;
  instructions: string[];
  muscles: CanonicalMuscle[];
  equipment: CanonicalEquipment[];
  media: CanonicalMedia[];
}

// Every exercise data source (third-party API, self-hosted DB, manual entry)
// implements this interface. The ingestion job only ever depends on this
// contract, never on a provider's own client/SDK shape.
export interface ExerciseSourceAdapter {
  readonly providerName: string;
  fetchAll(): Promise<CanonicalExercise[]>;
}
