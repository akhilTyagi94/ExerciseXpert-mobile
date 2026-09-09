import { router } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';
import { Pill } from '@/design-system/components/Pill';
import { mockMuscleGroups } from '@/data/mockExercises';

const EQUIPMENT_FILTERS = ['All Gear', 'Dumbbell', 'Barbell', 'Cable'];

export default function TargetsScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$surfaceCanvas">
      <YStack padding="$md" gap="$lg" paddingBottom="$3xl">
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$primary" fontFamily="$body" fontSize="$labelCaps" fontWeight="800">
              EXERCISEXPERT
            </Text>
            <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
              Target Muscles
            </Text>
          </YStack>
          <XStack alignItems="center" gap="$md">
            <Search size={20} color="#F8FAFC" />
            <Bell size={20} color="#F8FAFC" />
          </XStack>
        </XStack>

        <YStack gap="$xs">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$headlineMd" fontWeight="700">
            Target Anatomy
          </Text>
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Select an active kinetic zone to isolate muscle recruitment and discover certified
            movements.
          </Text>
        </YStack>

        {/* Interactive body-map "zone scanner" is a real design element that
            needs its own dedicated build (SVG hit-regions per muscle zone) —
            placeholder box here stands in for it in this navigation skeleton. */}
        <Card height={220} alignItems="center" justifyContent="center">
          <Text color="$placeholderColor" fontFamily="$body" fontSize="$bodyBase">
            Zone Scanner (anterior / posterior body map)
          </Text>
        </Card>

        <YStack gap="$sm">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$labelCaps" fontWeight="700" letterSpacing="$labelCaps">
            EQUIPMENT FILTER
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$sm">
              {EQUIPMENT_FILTERS.map((chip, index) => (
                <Pill key={chip} label={chip} variant={index === 0 ? 'active' : 'neutral'} />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack gap="$md">
          {mockMuscleGroups.map((group) => (
            <Card key={group.slug} onPress={() => router.push(`/exercise/${group.slug}`)} padding="$md" gap="$sm">
              <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack flex={1} gap="$xs">
                  <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700" textTransform="capitalize">
                    {group.name}
                  </Text>
                  <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                    {group.subtitle}
                  </Text>
                </YStack>
                <Pill label={`${group.exerciseCount} Exercises`} variant="target" />
              </XStack>
              <XStack gap="$xs" flexWrap="wrap">
                {group.tags.map((tag) => (
                  <Pill key={tag} label={tag} variant="neutral" />
                ))}
              </XStack>
            </Card>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
