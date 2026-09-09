import { styled, YStack } from 'tamagui';

// The design system's "signature asymmetry": sharp top corners, a
// pronounced bottom-left radius, and (in the "accented" variant) a 4px
// crimson top border that anchors resting cards before interaction.
export const Card = styled(YStack, {
  backgroundColor: '$surfaceContainer',
  borderRadius: '$sm',
  borderBottomLeftRadius: '$cardBottomLeft',
  borderWidth: 1,
  borderColor: '$border',
  overflow: 'hidden',

  variants: {
    accented: {
      true: {
        borderTopWidth: 4,
        borderTopColor: '$primary',
      },
    },
  } as const,
});
