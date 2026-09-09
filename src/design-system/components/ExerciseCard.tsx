import { Image } from 'expo-image';
import { Heart, Play } from 'lucide-react-native';
import { Text, XStack, YStack } from 'tamagui';

import type { ExerciseSummary } from '@/domain/exercise';

import { Card } from './Card';
import { Pill } from './Pill';

export function ExerciseCard({
  exercise,
  onPress,
}: {
  exercise: ExerciseSummary;
  onPress?: () => void;
}) {
  const [primaryMuscle, ...secondaryMuscles] = exercise.muscles;

  return (
    <Card accented onPress={onPress} pressStyle={{ scale: 0.98 }}>
      <YStack height={220}>
        <Image
          source={{ uri: exercise.media.posterUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <XStack position="absolute" top="$sm" left="$sm">
          <Pill label="GIF GUIDE" variant="active" />
        </XStack>
        <XStack
          position="absolute"
          top="$sm"
          right="$sm"
          width={36}
          height={36}
          borderRadius="$full"
          backgroundColor="$surfaceCanvas"
          opacity={0.85}
          alignItems="center"
          justifyContent="center">
          <Heart size={18} color="#F8FAFC" />
        </XStack>
      </YStack>

      <YStack padding="$md" gap="$sm">
        <XStack gap="$xs" flexWrap="wrap">
          <Pill label={primaryMuscle.name} variant="muscle" />
          {exercise.equipment.map((item) => (
            <Pill key={item.slug} label={item.name} variant="target" />
          ))}
          {exercise.difficulty ? <Pill label={exercise.difficulty} variant="neutral" /> : null}
        </XStack>

        <Text
          color="$textPrimary"
          fontFamily="$body"
          fontSize="$titleLg"
          lineHeight="$titleLg"
          fontWeight="700"
          textTransform="capitalize">
          {exercise.name}
        </Text>

        {secondaryMuscles.length > 0 ? (
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption" lineHeight="$caption">
            Secondary: {secondaryMuscles.map((m) => m.name).join(', ')}
          </Text>
        ) : null}

        <XStack justifyContent="space-between" alignItems="center" paddingTop="$xs">
          {exercise.setsReps ? (
            <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="600">
              {exercise.setsReps}
            </Text>
          ) : (
            <YStack />
          )}
          <XStack alignItems="center" gap="$xs">
            <Play size={14} color="#FCC757" />
            <Text color="$tertiary" fontFamily="$body" fontSize="$tagPill" fontWeight="700">
              Play Demo
            </Text>
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}
