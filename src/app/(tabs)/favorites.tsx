import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, YStack } from 'tamagui';

import { ExerciseCard } from '@/design-system/components/ExerciseCard';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { ScreenHeader } from '@/design-system/components/ScreenHeader';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteExercises } from '@/hooks/useFavorites';

// No mockup exists for this tab in the design export (see the architecture
// proposal's decision log) — layout is a placeholder built around the real
// favorites data.
export default function FavoritesScreen() {
  const { isSignedIn } = useAuth();
  const { data: favorites = [] } = useFavoriteExercises();

  if (!isSignedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
        <YStack flex={1} backgroundColor="$surfaceCanvas" padding="$md" gap="$xl">
          <ScreenHeader title="Favorites" />
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$md">
            <Heart size={40} color="#2C3852" />
            <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
              Sign in to see your favorites
            </Text>
            <PrimaryButton label="Sign In" onPress={() => router.push('/auth')} />
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
        <YStack flex={1} backgroundColor="$surfaceCanvas" padding="$md" gap="$xl">
          <ScreenHeader title="Favorites" />
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$md">
            <Heart size={40} color="#2C3852" />
            <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
              No favorites yet
            </Text>
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase" textAlign="center">
              Tap the heart on any exercise to save it here.
            </Text>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$surfaceCanvas">
        <YStack padding="$md" gap="$md" paddingBottom="$3xl">
          <ScreenHeader title="Favorites" />
          {favorites.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} onPress={() => router.push(`/exercise/${exercise.slug}`)} />
          ))}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
