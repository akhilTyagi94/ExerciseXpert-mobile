import { useEntitlementStore } from '@/state/entitlementStore';

// Centralized ad frequency capping (architecture proposal §8) — every ad
// placement calls through here instead of running its own cooldown timer.
// No AdMob account exists yet, so this only decides *whether* an ad should
// show; actual ad requests are wired in once `react-native-google-mobile-ads`
// is installed and EXPO_PUBLIC_ADMOB_IOS_APP_ID / _ANDROID_APP_ID are set.

export const isAdMobConfigured = Boolean(
  process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID
);

const INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;
let lastInterstitialAt = 0;

function isEntitledToRemoveAds(): boolean {
  return useEntitlementStore.getState().tier === 'premium';
}

export function shouldShowBannerAd(): boolean {
  return !isEntitledToRemoveAds();
}

export function shouldShowInterstitialAd(): boolean {
  if (isEntitledToRemoveAds()) return false;
  return Date.now() - lastInterstitialAt > INTERSTITIAL_COOLDOWN_MS;
}

export function recordInterstitialShown(): void {
  lastInterstitialAt = Date.now();
}
