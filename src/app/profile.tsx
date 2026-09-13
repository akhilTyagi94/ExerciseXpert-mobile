import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';
import { FeatureGate } from '@/design-system/components/FeatureGate';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionTier } from '@/hooks/useEntitlement';
import { restorePurchases } from '@/services/subscriptions/revenuecat';
import { goBack } from '@/utils/navigation';

// No mockup exists for Profile/Settings yet (flagged in the architecture
// proposal's decision log) — this placeholder exists only so "restore
// purchases" and account access have a real navigation destination.
export default function ProfileScreen() {
  const { user, isSignedIn, signOut } = useAuth();
  const tier = useSubscriptionTier();
  const [isRestoring, setIsRestoring] = useState(false);

  async function handleRestore() {
    setIsRestoring(true);
    try {
      await restorePurchases();
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$surfaceCanvas" padding="$md" gap="$lg">
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            Profile
          </Text>
          <X size={22} color="#F8FAFC" onPress={goBack} />
        </XStack>

        <YStack alignItems="center" gap="$sm">
          <YStack width={72} height={72} borderRadius="$full" backgroundColor="$surfaceElevated" />
          <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
            {isSignedIn ? user!.email : 'Guest'}
          </Text>
          {!isSignedIn ? (
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
              Sign in to save workouts and sync progress
            </Text>
          ) : null}
        </YStack>

        {tier === 'free' ? <PrimaryButton label="Go Premium" onPress={() => router.push('/paywall')} /> : null}

        {isSignedIn ? (
          <PrimaryButton label="Sign Out" variant="ghost" onPress={() => signOut()} />
        ) : (
          <PrimaryButton label="Sign In" onPress={() => router.push('/auth')} />
        )}

        <FeatureGate
          feature="workoutHistory"
          fallback={
            <Card padding="$md" gap="$xs" onPress={() => router.push('/paywall')}>
              <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
                Workout History & Progress
              </Text>
              <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                Premium feature — tap to upgrade.
              </Text>
            </Card>
          }>
          <Card padding="$md">
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
              Workout history & progress tracking — UI not built yet (Phase 4).
            </Text>
          </Card>
        </FeatureGate>

        <PrimaryButton
          label={isRestoring ? 'Please wait...' : 'Restore Purchases'}
          variant="ghost"
          onPress={isRestoring ? undefined : handleRestore}
        />
      </YStack>
    </SafeAreaView>
  );
}
