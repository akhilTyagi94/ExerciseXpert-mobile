import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import { AdBanner } from '@/design-system/components/AdBanner';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { ExerciseCard } from '@/design-system/components/ExerciseCard';
import { Pill } from '@/design-system/components/Pill';
import { ScreenContainer } from '@/design-system/components/ScreenContainer';
import { ScreenHeader } from '@/design-system/components/ScreenHeader';
import { SectionHeading } from '@/design-system/components/SectionHeading';
import { useExerciseCount, useExercises, useMuscleGroups } from '@/hooks/useExercises';

export default function ExploreScreen() {
  const { data: exercises = [] } = useExercises();
  const { data: totalCount = 0 } = useExerciseCount();
  const { data: muscleGroups = [] } = useMuscleGroups();
  const topMuscleGroups = muscleGroups.slice(0, 4);

  function openMuscleFilter(slug: string, name: string) {
    router.push({ pathname: '/exercise-list', params: { muscle: slug, title: name } });
  }

  return (
    <ScreenContainer>
      <YStack padding="$md" gap="$lg" paddingBottom="$3xl">
        {/* Not pinned to the viewport edge yet — the real AdMob SDK renders
            its own native banner view once wired, which has a different
            anchoring model than a JS sticky overlay, so revisit positioning
            then rather than building a bespoke overlay for a placeholder. */}
        <AdBanner />

        <ScreenHeader />

        <YStack gap="$xs">
          <XStack alignItems="center" gap="$xs">
            <View width={6} height={6} borderRadius="$full" backgroundColor="$primary" />
            <Text color="$primary" fontFamily="$body" fontSize="$labelCaps" fontWeight="700" letterSpacing="$labelCaps">
              READY TO DOMINATE
            </Text>
          </XStack>
          <Text color="$textPrimary" fontFamily="$body" fontSize="$displayHeroMobile" lineHeight="$displayHeroMobile" fontWeight="800">
            Crush Your Goals, Alex
          </Text>
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase" lineHeight="$bodyBase">
            Explore 1,300+ precision movements curated for your training style.
          </Text>
        </YStack>

        <XStack
          height={56}
          borderRadius="$full"
          backgroundColor="$surfaceContainer"
          borderWidth={1}
          borderColor="$border"
          alignItems="center"
          paddingHorizontal="$md"
          gap="$sm"
          onPress={() => router.push({ pathname: '/exercise-list', params: { mode: 'search' } })}>
          <Search size={18} color="#64748B" />
          <Text flex={1} color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Search {totalCount || '1,300'}+ exercises...
          </Text>
        </XStack>

        <YStack gap="$sm">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$labelCaps" fontWeight="700" letterSpacing="$labelCaps">
            TARGET FOCUS
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$sm">
              <Pill
                label={`All (${totalCount})`}
                variant="active"
                onPress={() => router.push({ pathname: '/exercise-list', params: { title: 'All Exercises' } })}
              />
              {topMuscleGroups.map((group) => (
                <Pill
                  key={group.slug}
                  label={group.name}
                  variant="neutral"
                  onPress={() => openMuscleFilter(group.slug, group.name)}
                />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack backgroundColor="$surfaceContainer" borderRadius="$md" padding="$md" gap="$sm">
          <Text color="$tertiary" fontFamily="$body" fontSize="$labelCaps" fontWeight="700" letterSpacing="$labelCaps">
            DAILY INTENSITY PICK
          </Text>
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            Upper Hypertrophy Ramp
          </Text>
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            High volume chest & upper-back compound synergy for dense muscular symmetry.
          </Text>
          <XStack gap="$xs">
            <Pill label="Barbell & Cable" variant="neutral" />
            <Pill label="5 Movements" variant="neutral" />
          </XStack>
          <PrimaryButton label="Start Workout" />
        </YStack>

        <YStack gap="$md">
          <SectionHeading eyebrow={`${exercises.length} Available · Auto-synced`} title="Featured Movements" />
          <YStack gap="$md">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onPress={() => router.push(`/exercise/${exercise.slug}`)}
              />
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScreenContainer>
  );
}
