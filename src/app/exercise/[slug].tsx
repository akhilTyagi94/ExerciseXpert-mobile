import { router, useLocalSearchParams } from 'expo-router';
import { Bookmark, ChevronLeft, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';
import { ExerciseCard } from '@/design-system/components/ExerciseCard';
import { Pill } from '@/design-system/components/Pill';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { ScreenContainer } from '@/design-system/components/ScreenContainer';
import { SectionHeading } from '@/design-system/components/SectionHeading';
import { useExercise } from '@/hooks/useExercises';
import { useExerciseVideos } from '@/hooks/useExerciseVideos';

export default function ExerciseDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: exercise, isPending } = useExercise(slug);
  const { data: videos = [] } = useExerciseVideos(exercise?.name);

  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
        <YStack flex={1} backgroundColor="$surfaceCanvas" alignItems="center" justifyContent="center">
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Loading exercise...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
        <YStack flex={1} backgroundColor="$surfaceCanvas" alignItems="center" justifyContent="center" gap="$sm" padding="$xl">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            Exercise not found
          </Text>
          <ChevronLeft size={22} color="#F8FAFC" onPress={() => router.back()} />
        </YStack>
      </SafeAreaView>
    );
  }

  const [primaryMuscle, ...secondaryMuscles] = exercise.muscles;

  return (
    <ScreenContainer>
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
            {primaryMuscle ? <Pill label={primaryMuscle.name} variant="muscle" /> : null}
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

        {videos.length > 0 ? (
          <YStack gap="$md">
            <SectionHeading eyebrow="YouTube" title="Technique Videos" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$md">
                {videos.map((video) => (
                  <Card key={video.videoId} width={220} padding="$sm" gap="$xs">
                    <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="600" numberOfLines={2}>
                      {video.title}
                    </Text>
                    {video.channelName ? (
                      <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                        {video.channelName}
                      </Text>
                    ) : null}
                  </Card>
                ))}
              </XStack>
            </ScrollView>
          </YStack>
        ) : null}

        <YStack gap="$md">
          <SectionHeading
            eyebrow="Related"
            title={primaryMuscle ? `More ${primaryMuscle.name} Exercises` : 'Related Exercises'}
          />
          <YStack gap="$md">
            {exercise.relatedExercises.map((related) => (
              <ExerciseCard key={related.id} exercise={related} onPress={() => router.push(`/exercise/${related.slug}`)} />
            ))}
          </YStack>
        </YStack>

        <PrimaryButton label="Log Sets & Timer" />
      </YStack>
    </ScreenContainer>
  );
}
