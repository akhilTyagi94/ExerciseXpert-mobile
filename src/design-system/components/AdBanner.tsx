import { Text, XStack } from 'tamagui';

import { isAdMobConfigured, shouldShowBannerAd } from '@/services/ads/adManager';
import { useSubscriptionTier } from '@/hooks/useEntitlement';

// Sticky-bottom banner placement (architecture proposal §8) for Explore and
// Targets. Renders nothing for premium users. Until an AdMob account exists,
// renders a placeholder instead of a real ad — swap the inner content for
// `BannerAd` from `react-native-google-mobile-ads` once configured, keeping
// the shouldShowBannerAd() gate the same.
export function AdBanner() {
  // Subscribing to the tier here (not just calling shouldShowBannerAd() once)
  // so the banner disappears immediately after a purchase, without needing a
  // screen remount.
  useSubscriptionTier();
  if (!shouldShowBannerAd()) return null;

  return (
    <XStack
      height={50}
      borderRadius="$sm"
      backgroundColor="$surfaceElevated"
      borderWidth={1}
      borderColor="$border"
      alignItems="center"
      justifyContent="center">
      <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
        {isAdMobConfigured ? 'Ad' : 'Ad placeholder — AdMob not configured yet'}
      </Text>
    </XStack>
  );
}
