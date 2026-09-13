import { Text, XStack } from 'tamagui';

export type PillVariant = 'muscle' | 'target' | 'neutral' | 'active';

const VARIANT_STYLES: Record<PillVariant, { bg: string; color: string }> = {
  muscle: { bg: '$muscleTagBg', color: '$muscleTagText' },
  target: { bg: '$targetTagBg', color: '$targetTagText' },
  neutral: { bg: '$surfaceElevated', color: '$textPrimary' },
  active: { bg: '$primary', color: '$white' },
};

export function Pill({
  label,
  variant = 'neutral',
  onPress,
}: {
  label: string;
  variant?: PillVariant;
  onPress?: () => void;
}) {
  const { bg, color } = VARIANT_STYLES[variant];
  return (
    <XStack backgroundColor={bg} borderRadius="$full" paddingHorizontal="$md" paddingVertical="$xs" onPress={onPress}>
      <Text color={color} fontFamily="$body" fontSize="$tagPill" lineHeight="$tagPill" fontWeight="700">
        {label}
      </Text>
    </XStack>
  );
}
