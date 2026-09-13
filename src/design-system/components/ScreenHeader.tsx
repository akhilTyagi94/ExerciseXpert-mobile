import { router } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { Text, View, XStack, YStack } from 'tamagui';

// The wordmark + search/notification/profile icon row, previously
// copy-pasted per screen (and missing the profile icon entirely on Targets/
// Routines/Favorites). One shared header so every tab can reach Profile and
// Search consistently.
export function ScreenHeader({ title }: { title?: string }) {
  return (
    <XStack justifyContent="space-between" alignItems="center">
      <YStack>
        <Text color="$primary" fontFamily="$body" fontSize="$labelCaps" fontWeight="800">
          EXERCISEXPERT
        </Text>
        {title ? (
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            {title}
          </Text>
        ) : null}
      </YStack>
      <XStack alignItems="center" gap="$md">
        <Search size={20} color="#F8FAFC" onPress={() => router.push({ pathname: '/exercise-list', params: { mode: 'search' } })} />
        {/* No notification system exists yet (Phase 4) — icon is inert. */}
        <Bell size={20} color="#F8FAFC" />
        <View
          onPress={() => router.push('/profile')}
          width={32}
          height={32}
          borderRadius="$full"
          backgroundColor="$surfaceElevated"
        />
      </XStack>
    </XStack>
  );
}
