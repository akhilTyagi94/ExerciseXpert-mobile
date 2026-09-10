import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'tamagui';

// Every screen was rendering its header directly under the status bar/notch
// (no safe-area awareness), overlapping the system clock. Centralizing the
// fix here instead of adding insets to each of the 6 screens individually.
export function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$surfaceCanvas">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
