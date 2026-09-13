import { create } from 'zustand';

import { FEATURE_REQUIREMENTS, type FeatureKey, type SubscriptionTier } from '@/domain/entitlements';

interface EntitlementState {
  tier: SubscriptionTier;
}

// Starts 'free' and stays that way until purchasePackage()/restorePurchases()
// in services/subscriptions/revenuecat.ts resolve — see that file for why
// there's no hydration step yet (no RevenueCat account exists to hydrate
// from). Once wired, a RevenueCat listener updates this the same way
// authStore's onAuthStateChange listener updates auth state.
export const useEntitlementStore = create<EntitlementState>(() => ({
  tier: 'free',
}));

export function setTier(tier: SubscriptionTier) {
  useEntitlementStore.setState({ tier });
}

export function hasAccess(feature: FeatureKey, tier: SubscriptionTier): boolean {
  return tier === 'premium' || FEATURE_REQUIREMENTS[feature] === 'free';
}
