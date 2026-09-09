import type { ReactNode } from 'react';
import { Text, XStack } from 'tamagui';

export function PrimaryButton({
  label,
  icon,
  onPress,
  variant = 'solid',
}: {
  label: string;
  icon?: ReactNode;
  onPress?: () => void;
  variant?: 'solid' | 'ghost';
}) {
  const isGhost = variant === 'ghost';
  return (
    <XStack
      height={56}
      borderRadius="$sm"
      alignItems="center"
      justifyContent="center"
      gap="$sm"
      backgroundColor={isGhost ? '$surfaceContainer' : '$primary'}
      borderWidth={isGhost ? 1 : 0}
      borderColor="$border"
      pressStyle={{ backgroundColor: isGhost ? '$surfaceElevated' : '$secondary' }}
      onPress={onPress}>
      {icon}
      <Text
        color={isGhost ? '$textPrimary' : '$white'}
        fontFamily="$body"
        fontSize="$labelCaps"
        lineHeight="$labelCaps"
        fontWeight="700"
        letterSpacing="$labelCaps"
        textTransform="uppercase">
        {label}
      </Text>
    </XStack>
  );
}
