// Free vs. premium feature matrix from the architecture proposal (§12).
// One place mapping a feature to the tier it requires — the resolver and
// FeatureGate both read from here instead of scattering `if (isPremium)`
// checks across screens.

export type SubscriptionTier = 'free' | 'premium';

export type FeatureKey =
  | 'removeAds'
  | 'unlimitedSavedWorkouts'
  | 'workoutHistory'
  | 'advancedFilters'
  | 'aiGeneratedWorkouts'
  | 'advancedAnalytics'
  | 'unlimitedSavedRoutines';

export const FEATURE_REQUIREMENTS: Record<FeatureKey, SubscriptionTier> = {
  removeAds: 'premium',
  unlimitedSavedWorkouts: 'premium',
  workoutHistory: 'premium',
  advancedFilters: 'premium',
  aiGeneratedWorkouts: 'premium',
  advancedAnalytics: 'premium',
  unlimitedSavedRoutines: 'premium',
};
