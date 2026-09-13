import { FEATURE_REQUIREMENTS, type FeatureKey, type SubscriptionTier } from '@/domain/entitlements';
import { useEntitlementStore } from '@/state/entitlementStore';

export function useSubscriptionTier(): SubscriptionTier {
  return useEntitlementStore((state) => state.tier);
}

export function useEntitlement(feature: FeatureKey): boolean {
  const tier = useSubscriptionTier();
  return tier === 'premium' || FEATURE_REQUIREMENTS[feature] === 'free';
}
