import { router } from 'expo-router';
import { Bookmark, ChevronLeft, ShieldAlert } from 'lucide-react-native';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';
import { ExerciseCard } from '@/design-system/components/ExerciseCard';
import { Pill } from '@/design-system/components/Pill';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { SectionHeading } from '@/design-system/components/SectionHeading';
import { mockExerciseDetail } from '@/data/mockExercises';

// Always renders the one mock exercise regardless of :slug — there is no
// backend to query yet (see ingestion/ and supabase/migrations/). Swap this
// for a TanStack Query `useExercise(slug)` hook once the API layer exists.
export default function ExerciseDetailScreen() {
  const exercise = mockExerciseDetail;
  const [primaryMuscle, ...secondaryMuscles] = exercise.muscles;

  return (
    <ScrollView flex={1} backgroundColor="$surfaceCanvas">
      <YStack padding="$md" gap="$lg" paddingBottom="$3xl">
        <XStack justifyContent="space-between" alignItems="center">
          <ChevronLeft size={22} color="#F8FAFC" onPress={() => router.back()} />
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            Exercise Detail
          </Text>
          <Bookmark size={20} color="#F8FAFC" />
        </XStack>

        {/* Real build needs the "animated workout canvas" (looping video +
            angle/speed scrubber) described in design_system.md — placeholder
            here stands in for it, see § Mobile app architecture / Media
            rendering in the proposal for the expo-video approach. */}
        <Card height={260} alignItems="center" justifyContent="center" gap="$sm">
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Exercise media (looping video, angle/speed controls)
          </Text>
        </Card>

        <YStack gap="$sm">
          <Text color="$primary" fontFamily="$body" fontSize="$labelCaps" fontWeight="700" letterSpacing="$labelCaps">
            TARGET ANATOMY & APPARATUS
          </Text>
          <XStack gap="$xs" flexWrap="wrap">
            <Pill label={primaryMuscle.name} variant="muscle" />
            {secondaryMuscles.length > 0 ? (
              <Pill label={secondaryMuscles.map((m) => m.name).join(', ')} variant="target" />
            ) : null}
          </XStack>
          <Card padding="$md" flexDirection="row" alignItems="center" gap="$sm">
            <YStack>
              <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                REQUIRED EQUIPMENT
              </Text>
              <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
                {exercise.equipment.map((e) => e.name).join(', ')}
              </Text>
            </YStack>
          </Card>
        </YStack>

        <YStack gap="$md">
          <SectionHeading eyebrow="Biomechanical Form" title="Execution Steps" />
          {exercise.instructions.map((step, index) => (
            <Card key={step} padding="$md" flexDirection="row" gap="$md" alignItems="flex-start">
              <YStack width={28} height={28} borderRadius="$full" backgroundColor="$primary" alignItems="center" justifyContent="center">
                <Text color="$white" fontFamily="$body" fontWeight="700">
                  {index + 1}
                </Text>
              </YStack>
              <Text flex={1} color="$textPrimary" fontFamily="$body" fontSize="$bodyBase" lineHeight="$bodyBase">
                {step}
              </Text>
            </Card>
          ))}
        </YStack>

        <Card padding="$md" gap="$sm">
          <XStack alignItems="center" gap="$xs">
            <ShieldAlert size={18} color="#FCC757" />
            <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
              Critical Safety & Form Pitfalls
            </Text>
          </XStack>
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Full pitfall content (e.g. "Avoid Flared Elbows", "Excessive Lumbar Arching") is authored
            per exercise — not yet in the canonical schema's `instructions` field. Track as a schema
            follow-up.
          </Text>
        </Card>

        <YStack gap="$md">
          <SectionHeading eyebrow="RapidAPI Exercise DB" title="Related Chest Drills" />
          <YStack gap="$md">
            {exercise.relatedExercises.map((related) => (
              <ExerciseCard key={related.id} exercise={related} onPress={() => router.push(`/exercise/${related.slug}`)} />
            ))}
          </YStack>
        </YStack>

        <PrimaryButton label="Log Sets & Timer" />
      </YStack>
    </ScrollView>
  );
}
