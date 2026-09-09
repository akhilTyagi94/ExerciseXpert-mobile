import { router } from 'expo-router';
import { Bell, Search, SlidersHorizontal } from 'lucide-react-native';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { ExerciseCard } from '@/design-system/components/ExerciseCard';
import { Pill } from '@/design-system/components/Pill';
import { SectionHeading } from '@/design-system/components/SectionHeading';
import { mockExercises } from '@/data/mockExercises';

const TARGET_FOCUS_CHIPS = ['All (1,348)', 'Chest', 'Back', 'Legs', 'Arms'];

export default function ExploreScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$surfaceCanvas">
      <YStack padding="$md" gap="$lg" paddingBottom="$3xl">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$xs">
            <Text color="$primary" fontFamily="$body" fontSize="$labelCaps" fontWeight="800">
              EXERCISEXPERT
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$md">
            <Search size={20} color="#F8FAFC" />
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
          gap="$sm">
          <Search size={18} color="#64748B" />
          <Text flex={1} color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Search 1,300+ exercises...
          </Text>
          <SlidersHorizontal size={18} color="#F8FAFC" />
        </XStack>

        <YStack gap="$sm">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$labelCaps" fontWeight="700" letterSpacing="$labelCaps">
            TARGET FOCUS
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$sm">
              {TARGET_FOCUS_CHIPS.map((chip, index) => (
                <Pill key={chip} label={chip} variant={index === 0 ? 'active' : 'neutral'} />
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
          <SectionHeading eyebrow="4 Available · Auto-synced" title="Featured Movements" />
          <YStack gap="$md">
            {mockExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onPress={() => router.push(`/exercise/${exercise.slug}`)}
              />
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
