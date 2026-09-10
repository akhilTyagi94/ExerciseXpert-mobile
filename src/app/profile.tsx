import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';

// No mockup exists for Profile/Settings yet (flagged in the architecture
// proposal's decision log) — this placeholder exists only so "restore
// purchases" and account access have a real navigation destination ahead of
// Phase 2 (accounts) and Phase 3 (subscriptions).
export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$surfaceCanvas" padding="$md" gap="$lg">
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            Profile
          </Text>
          <X size={22} color="#F8FAFC" onPress={() => router.back()} />
        </XStack>

        <YStack alignItems="center" gap="$sm">
          <YStack width={72} height={72} borderRadius="$full" backgroundColor="$surfaceElevated" />
          <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
            Guest
          </Text>
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
            Sign in to save workouts and sync progress (Phase 2)
          </Text>
        </YStack>

        <Card padding="$md">
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Restore Purchases — wired up once RevenueCat is integrated (Phase 3).
          </Text>
        </Card>
      </YStack>
    </SafeAreaView>
  );
}
