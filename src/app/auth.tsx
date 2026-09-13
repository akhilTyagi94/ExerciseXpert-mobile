import { X } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Text, XStack, YStack } from 'tamagui';

import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { goBack } from '@/utils/navigation';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'sign-up') {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$surfaceCanvas" padding="$md" gap="$lg">
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textPrimary" fontFamily="$body" fontSize="$titleLg" fontWeight="700">
            {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </Text>
          <X size={22} color="#F8FAFC" onPress={goBack} />
        </XStack>

        <YStack gap="$sm">
          <Input
            placeholder="Email"
            placeholderTextColor="$placeholderColor"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            backgroundColor="$surfaceContainer"
            borderColor="$border"
            color="$textPrimary"
            height={56}
          />
          <Input
            placeholder="Password"
            placeholderTextColor="$placeholderColor"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            backgroundColor="$surfaceContainer"
            borderColor="$border"
            color="$textPrimary"
            height={56}
          />
        </YStack>

        {error ? (
          <Text color="$secondary" fontFamily="$body" fontSize="$caption">
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          label={isSubmitting ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          onPress={isSubmitting ? undefined : handleSubmit}
        />

        <Text
          color="$placeholderColor"
          fontFamily="$body"
          fontSize="$bodyBase"
          textAlign="center"
          onPress={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
          {mode === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
          <Text color="$primary" fontWeight="700">
            {mode === 'sign-in' ? 'Create one' : 'Sign in'}
          </Text>
        </Text>
      </YStack>
    </SafeAreaView>
  );
}
