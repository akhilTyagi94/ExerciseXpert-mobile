// Direct data-mapping of designs/ExerciseXpert Design/design_system.md
// ("Obsidian Kinetic Pulse"). Keep this file's values in lockstep with that
// document — it is the single source of truth for the palette, not the
// conflicting Material-style token set in that file's YAML frontmatter
// (see the architecture proposal's decision log).

export const colors = {
  primary: '#FF2625', // Electric Crimson — CTAs, active tabs, category rules
  secondary: '#E63946', // Crimson Pulse — hover, destructive, focus rings
  tertiary: '#FCC757', // Target Amber — anatomical target badges, PRs, stats
  neutral: '#0B0F19', // Deep Obsidian Slate — root canvas

  surfaceCanvas: '#0B0F19',
  surfaceContainer: '#151C2C',
  surfaceElevated: '#1D263B',
  surfaceActive: '#232E46',
  border: '#2C3852',
  borderLowEmphasis: '#1C2538',

  muscleTagBg: '#FFA9A9',
  muscleTagText: '#3A1212',
  targetTagBg: '#FCC757',
  targetTagText: '#3B2500',
  equipmentIconBg: '#FFF2DB',
  equipmentIconFg: '#341212',
  successMint: '#10B981',

  textPrimary: '#F8FAFC',
  textPlaceholder: '#64748B',
  white: '#FFFFFF',
} as const;

// design_system.md `typography` block, unchanged names/values.
export const typography = {
  displayWatermark: { fontSize: 160, lineHeight: 160, fontWeight: '800', letterSpacing: -0.04 * 160 },
  displayHero: { fontSize: 44, lineHeight: 56, fontWeight: '800', letterSpacing: -0.02 * 44 },
  displayHeroMobile: { fontSize: 30, lineHeight: 38, fontWeight: '800', letterSpacing: -0.02 * 30 },
  headlineLg: { fontSize: 32, lineHeight: 40, fontWeight: '700', letterSpacing: -0.01 * 32 },
  headlineLgMobile: { fontSize: 26, lineHeight: 34, fontWeight: '700', letterSpacing: -0.01 * 26 },
  headlineMd: { fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: 0 },
  titleLg: { fontSize: 20, lineHeight: 28, fontWeight: '600', letterSpacing: 0 },
  subtitleBase: { fontSize: 18, lineHeight: 28, fontWeight: '400', letterSpacing: 0 },
  bodyBase: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0 },
  bodyBold: { fontSize: 16, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
  labelCaps: { fontSize: 14, lineHeight: 18, fontWeight: '700', letterSpacing: 0.04 * 14 },
  tagPill: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.02 * 13 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.01 * 12 },
} as const;

// 4px modular scale, in px (design_system.md uses rem @ 16px root).
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  gutterMobile: 20,
  gutterDesktop: 50,
  maxContentWidth: 1480,
} as const;

export const radii = {
  sm: 4,
  base: 8, // `DEFAULT` in design_system.md
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  // Signature asymmetric card corner (§ Shapes / Signature Asymmetry).
  cardBottomLeft: 20,
} as const;
