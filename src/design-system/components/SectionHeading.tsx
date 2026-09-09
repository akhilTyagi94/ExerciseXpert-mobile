import { Text, YStack } from 'tamagui';

export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <YStack gap="$xs">
      {eyebrow ? (
        <Text
          color="$primary"
          fontFamily="$body"
          fontSize="$labelCaps"
          lineHeight="$labelCaps"
          fontWeight="700"
          letterSpacing="$labelCaps"
          textTransform="uppercase">
          {eyebrow}
        </Text>
      ) : null}
      <Text
        color="$textPrimary"
        fontFamily="$body"
        fontSize="$headlineMd"
        lineHeight="$headlineMd"
        fontWeight="700">
        {title}
      </Text>
    </YStack>
  );
}
