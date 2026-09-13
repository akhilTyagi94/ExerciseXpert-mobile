import { router } from 'expo-router';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

import { AdBanner } from '@/design-system/components/AdBanner';
import { Card } from '@/design-system/components/Card';
import { Pill } from '@/design-system/components/Pill';
import { ScreenContainer } from '@/design-system/components/ScreenContainer';
import { ScreenHeader } from '@/design-system/components/ScreenHeader';
import { useMuscleGroups } from '@/hooks/useExercises';

// Common ExerciseDB equipment slugs — matches the actual ingested data
// (see ingestion/adapters/exerciseDbAdapter.ts's slugify), not a live-fetched
// list, since this screen only needs a handful of popular filters, not a
// full equipment catalog.
const EQUIPMENT_FILTERS: { label: string; slug: string | null }[] = [
  { label: 'All Gear', slug: null },
  { label: 'Dumbbell', slug: 'dumbbell' },
  { label: 'Barbell', slug: 'barbell' },
  { label: 'Cable', slug: 'cable' },
];

export default function TargetsScreen() {
  const { data: muscleGroups = [] } = useMuscleGroups();

  function openMuscleFilter(slug: string, name: string) {
    router.push({ pathname: '/exercise-list', params: { muscle: slug, title: name } });
  }

  function openEquipmentFilter(slug: string | null, label: string) {
    if (!slug) {
      router.push({ pathname: '/exercise-list', params: { title: 'All Exercises' } });
      return;
    }
    router.push({ pathname: '/exercise-list', params: { equipment: slug, title: label } });
  }

  return (
    <ScreenContainer>
      <YStack padding="$md" gap="$lg" paddingBottom="$3xl">
        <AdBanner />

        <ScreenHeader title="Target Muscles" />

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
                <Pill
                  key={chip.label}
                  label={chip.label}
                  variant={index === 0 ? 'active' : 'neutral'}
                  onPress={() => openEquipmentFilter(chip.slug, chip.label)}
                />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack gap="$md">
          {muscleGroups.map((group) => (
            <Card key={group.slug} padding="$md" gap="$sm" onPress={() => openMuscleFilter(group.slug, group.name)}>
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
    </ScreenContainer>
  );
}
