import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, ScrollView, Text, XStack, YStack } from 'tamagui';

import { ExerciseCard } from '@/design-system/components/ExerciseCard';
import { useExercises, useExercisesByEquipment, useExercisesByMuscle, useSearchExercises } from '@/hooks/useExercises';

// One flexible list screen for every "tap a filter, see matching exercises"
// entry point (Target Focus chips, Target muscle cards, equipment filters,
// and header search) instead of near-duplicate screens per filter type.
export default function ExerciseListScreen() {
  const { mode, muscle, equipment, title } = useLocalSearchParams<{
    mode?: string;
    muscle?: string;
    equipment?: string;
    title?: string;
  }>();

  const isSearch = mode === 'search';
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const allExercises = useExercises();
  const muscleResults = useExercisesByMuscle(muscle ?? '');
  const equipmentResults = useExercisesByEquipment(equipment ?? '');
  const searchResults = useSearchExercises(debouncedQuery);

  const { data: exercises = [], isPending } = muscle
    ? muscleResults
    : equipment
      ? equipmentResults
      : isSearch
        ? searchResults
        : allExercises;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$surfaceCanvas">
        <YStack padding="$md" gap="$md" paddingBottom="$3xl">
          <XStack alignItems="center" gap="$sm">
            <ChevronLeft size={22} color="#F8FAFC" onPress={() => router.back()} />
            {isSearch ? (
              <Input
                flex={1}
                autoFocus
                placeholder="Search exercises..."
                placeholderTextColor="$placeholderColor"
                value={searchInput}
                onChangeText={setSearchInput}
                backgroundColor="$surfaceContainer"
                borderColor="$border"
                color="$textPrimary"
                height={48}
              />
            ) : (
              <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
                {title ?? 'Exercises'}
              </Text>
            )}
          </XStack>

          {isSearch && debouncedQuery.trim().length === 0 ? (
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase" textAlign="center" paddingTop="$xl">
              Start typing to search exercises.
            </Text>
          ) : isPending ? (
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase" textAlign="center" paddingTop="$xl">
              Loading...
            </Text>
          ) : exercises.length === 0 ? (
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase" textAlign="center" paddingTop="$xl">
              No exercises found.
            </Text>
          ) : (
            <YStack gap="$md">
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} onPress={() => router.push(`/exercise/${exercise.slug}`)} />
              ))}
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
