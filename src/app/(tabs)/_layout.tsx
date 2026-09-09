import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { colors } from '@/design-system/tokens';

// 4-tab bottom nav confirmed from the design mockups (Explore, Targets,
// Routines, Favorites) — not the 5 separate screens the design export's
// screen titles implied (Exercise Detail is a pushed stack screen, reached
// from any tab, not a tab itself).
export default function TabsLayout() {
  return (
    <NativeTabs backgroundColor={colors.surfaceCanvas} tintColor={colors.primary} labelStyle={{ selected: { color: colors.primary } }}>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="flame.fill" md="local_fire_department" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="targets">
        <NativeTabs.Trigger.Label>Targets</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="target" md="gps_fixed" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="routines">
        <NativeTabs.Trigger.Label>Routines</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="play.circle.fill" md="play_circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="heart.fill" md="favorite" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
