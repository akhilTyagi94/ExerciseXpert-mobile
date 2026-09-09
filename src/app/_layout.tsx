import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider } from 'tamagui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { tamaguiConfig } from '@/design-system/tamagui.config';
import { colors } from '@/design-system/tokens';

SplashScreen.preventAutoHideAsync();

// The product is dark-only by design (see tamagui.config.ts) — there is no
// designed light mode, so the app always renders the "dark" Tamagui theme
// regardless of the device's system appearance setting.
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surfaceCanvas } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="exercise/[slug]" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
      </Stack>
    </TamaguiProvider>
  );
}
