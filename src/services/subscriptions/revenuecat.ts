import { setTier } from '@/state/entitlementStore';

// RevenueCat over StoreKit2 + Google Play Billing (architecture proposal §9).
// No RevenueCat account exists yet, so this only defines the plan catalog
// and a mock purchase flow — swap the bodies of purchasePackage/
// restorePurchases for real `react-native-purchases` calls once
// EXPO_PUBLIC_REVENUECAT_IOS_KEY / _ANDROID_KEY are set, following the same
// isXConfigured pattern as services/api/supabase.ts.

export const isRevenueCatConfigured = Boolean(
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
);

export interface SubscriptionPackage {
  id: 'monthly' | 'annual';
  title: string;
  period: string;
  priceLabel: string;
  trialDays?: number;
  recommended?: boolean;
}

// Confirmed price points: ₹50/month, ₹500/year. These are reference labels
// for the mock paywall only — once RevenueCat is wired, real (localized,
// per-store-region) prices come from its offerings API at runtime, and these
// values become the actual product prices to set up in App Store Connect /
// Google Play Console when creating the IAP products.
export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  { id: 'monthly', title: 'Monthly', period: 'per month', priceLabel: '₹50' },
  { id: 'annual', title: 'Annual', period: 'per year', priceLabel: '₹500', trialDays: 7, recommended: true },
];

export async function purchasePackage(_packageId: SubscriptionPackage['id']): Promise<void> {
  if (!isRevenueCatConfigured) {
    // Dev-only mock so the paywall → entitlement → ad-gating pipeline can be
    // exercised end-to-end before a RevenueCat account exists.
    setTier('premium');
    return;
  }
  throw new Error('RevenueCat SDK integration not implemented yet.');
}

export async function restorePurchases(): Promise<void> {
  if (!isRevenueCatConfigured) {
    setTier('premium');
    return;
  }
  throw new Error('RevenueCat SDK integration not implemented yet.');
}
