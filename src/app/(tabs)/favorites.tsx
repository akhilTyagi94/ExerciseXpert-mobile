import { Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

// No mockup exists for this tab in the design export (see the architecture
// proposal's decision log) — this is an honest empty state rather than
// invented content, to be replaced once the screen is designed.
export default function FavoritesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$surfaceCanvas" alignItems="center" justifyContent="center" gap="$md" padding="$xl">
        <Heart size={40} color="#2C3852" />
        <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
          No favorites yet
        </Text>
        <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase" textAlign="center">
          Tap the heart on any exercise to save it here. This screen has no design mockup yet — layout
          is a placeholder.
        </Text>
      </YStack>
    </SafeAreaView>
  );
}
