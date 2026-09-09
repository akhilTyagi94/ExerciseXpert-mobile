import { Bell, Play, Search } from 'lucide-react-native';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';
import { Pill } from '@/design-system/components/Pill';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { SectionHeading } from '@/design-system/components/SectionHeading';

// Mock content only — routine building, saved favorites, and PR tracking are
// real features (Phase 2/3 in the architecture proposal) with no backend
// support yet. This screen exists so the tab's navigation and layout are in
// place before that data model is built.
const EQUIPMENT_ROUTINES = [
  { title: 'Dumbbells Only', subtitle: 'Compact home gym setups', count: 18, tag: 'Hypertrophy Ready' },
  { title: 'Full Commercial Gym', subtitle: 'Barbells, cables & machines', count: 64, tag: 'Max Overload' },
];

const PERSONAL_RECORDS = [
  { name: 'Barbell Romanian Deadlift', muscle: 'Posterior Chain', pr: '145 kg × 6', when: '2 days ago' },
  { name: 'Weighted Dips', muscle: 'Triceps & Chest', pr: '+32 kg × 8', when: 'May 14' },
];

const ROUTINE_BUILDER = [
  { cycle: 'HYPERTROPHY CYCLE A', title: 'Push Day: Chest, Shoulders & Triceps', intensity: 'High Intensity', minutes: 45, exercises: 6, muscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'] },
  { cycle: 'HYPERTROPHY CYCLE B', title: 'Pull Day: Back, Rear Delts & Biceps', intensity: 'Standard', minutes: 50, exercises: 7, muscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps'] },
];

export default function RoutinesScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$surfaceCanvas">
      <YStack padding="$md" gap="$lg" paddingBottom="$3xl">
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$primary" fontFamily="$body" fontSize="$labelCaps" fontWeight="800">
              EXERCISEXPERT
            </Text>
            <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
              Routines
            </Text>
          </YStack>
          <XStack alignItems="center" gap="$md">
            <Search size={20} color="#F8FAFC" />
            <Bell size={20} color="#F8FAFC" />
          </XStack>
        </XStack>

        <Card padding="$md" flexDirection="row" justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$primary" fontFamily="$body" fontSize="$caption" fontWeight="700" letterSpacing="$labelCaps">
              ACTIVE REST INTERVAL
            </Text>
            <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
              01:09
            </Text>
            <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
              Next: Incline DB Press · Set 3 of 4
            </Text>
          </YStack>
          <Play size={28} color="#FF2625" />
        </Card>

        <YStack gap="$sm">
          <SectionHeading eyebrow="Gear Synced" title="Build by Equipment" />
          <XStack gap="$md">
            {EQUIPMENT_ROUTINES.map((item) => (
              <Card key={item.title} flex={1} padding="$md" gap="$xs">
                <Pill label={`${item.count} Exercises`} variant="target" />
                <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
                  {item.title}
                </Text>
                <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                  {item.subtitle}
                </Text>
                <Pill label={item.tag} variant="neutral" />
              </Card>
            ))}
          </XStack>
        </YStack>

        <YStack gap="$sm">
          <SectionHeading eyebrow="Personal Records" title="Saved Favorites" />
          <YStack gap="$sm">
            {PERSONAL_RECORDS.map((record) => (
              <Card key={record.name} padding="$md" flexDirection="row" justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
                    {record.name}
                  </Text>
                  <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                    {record.muscle} · {record.when}
                  </Text>
                </YStack>
                <Pill label={record.pr} variant="neutral" />
              </Card>
            ))}
          </YStack>
        </YStack>

        <YStack gap="$md">
          <SectionHeading eyebrow="Synergy Engine" title="Related Routine Builder" />
          {ROUTINE_BUILDER.map((routine) => (
            <Card key={routine.title} accented padding="$md" gap="$sm">
              <XStack justifyContent="space-between">
                <Text color="$tertiary" fontFamily="$body" fontSize="$caption" fontWeight="700" letterSpacing="$labelCaps">
                  {routine.cycle}
                </Text>
                <Pill label={routine.intensity} variant={routine.intensity === 'High Intensity' ? 'active' : 'neutral'} />
              </XStack>
              <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
                {routine.title}
              </Text>
              <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                {routine.minutes} mins · {routine.exercises} Exercises
              </Text>
              <XStack gap="$xs" flexWrap="wrap">
                {routine.muscles.map((muscle) => (
                  <Pill key={muscle} label={muscle} variant="neutral" />
                ))}
              </XStack>
              <PrimaryButton label={`Start ${routine.title.split(':')[0]}`} />
            </Card>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
