import { createFont, createTamagui, createTokens } from 'tamagui';

import { colors, radii, spacing, typography } from './tokens';

const size = {
  ...spacing,
  true: spacing.md,
} as const;

const tokens = createTokens({
  color: colors,
  space: { ...size, 0: 0 },
  size,
  radius: { ...radii, 0: 0 },
  zIndex: { modal: 100, overlay: 90, floating: 10 },
});

// Inter, weighted per design_system.md's named scale rather than Tamagui's
// default numeric ($1..$16) scale — screens reference sizes as
// `$headlineLg`, `$bodyBase`, etc. so they read the same as the design spec.
const interFont = createFont({
  family: 'Inter',
  size: Object.fromEntries(Object.entries(typography).map(([key, value]) => [key, value.fontSize])),
  lineHeight: Object.fromEntries(Object.entries(typography).map(([key, value]) => [key, value.lineHeight])),
  weight: Object.fromEntries(Object.entries(typography).map(([key, value]) => [key, value.fontWeight])),
  letterSpacing: Object.fromEntries(
    Object.entries(typography).map(([key, value]) => [key, value.letterSpacing])
  ),
  face: {
    400: { normal: 'Inter' },
    500: { normal: 'Inter' },
    600: { normal: 'Inter' },
    700: { normal: 'Inter' },
    800: { normal: 'Inter' },
  },
});

// The product is dark-only by design (design_system.md has no light-mode
// spec) — both theme names map to the same obsidian palette so the app
// renders correctly regardless of the device's system color scheme, without
// a second, undesigned light palette.
const obsidianTheme = {
  background: colors.surfaceCanvas,
  backgroundStrong: colors.surfaceContainer,
  backgroundHover: colors.surfaceElevated,
  backgroundPress: colors.surfaceActive,
  color: colors.textPrimary,
  colorHover: colors.white,
  borderColor: colors.border,
  placeholderColor: colors.textPlaceholder,
  primary: colors.primary,
  secondary: colors.secondary,
  tertiary: colors.tertiary,
};

export const tamaguiConfig = createTamagui({
  tokens,
  fonts: { body: interFont, heading: interFont },
  themes: { light: obsidianTheme, dark: obsidianTheme },
  media: {
    tablet: { minWidth: 600 },
    desktop: { minWidth: 1200 },
  },
  defaultFont: 'body',
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
