import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

import { Card } from '@/design-system/components/Card';
import { PrimaryButton } from '@/design-system/components/PrimaryButton';
import { useSubscriptionTier } from '@/hooks/useEntitlement';
import { purchasePackage, restorePurchases, SUBSCRIPTION_PACKAGES, type SubscriptionPackage } from '@/services/subscriptions/revenuecat';
import { goBack } from '@/utils/navigation';

const PREMIUM_BENEFITS = [
  'Ad-free experience',
  'Unlimited saved workouts',
  'Workout history & progress tracking',
  'Advanced filters & AI-generated workouts',
];

export default function PaywallScreen() {
  const tier = useSubscriptionTier();
  const [selectedId, setSelectedId] = useState<SubscriptionPackage['id']>('annual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setError(null);
    setIsSubmitting(true);
    try {
      await purchasePackage(selectedId);
      goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRestore() {
    setError(null);
    setIsSubmitting(true);
    try {
      await restorePurchases();
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
            Go Premium
          </Text>
          <X size={22} color="#F8FAFC" onPress={goBack} />
        </XStack>

        {tier === 'premium' ? (
          <Card padding="$md">
            <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBase">
              You're already Premium — thanks for the support.
            </Text>
          </Card>
        ) : (
          <>
            <YStack gap="$sm">
              {PREMIUM_BENEFITS.map((benefit) => (
                <XStack key={benefit} alignItems="center" gap="$sm">
                  <Check size={18} color="#FCC757" />
                  <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBase">
                    {benefit}
                  </Text>
                </XStack>
              ))}
            </YStack>

            <YStack gap="$sm">
              {SUBSCRIPTION_PACKAGES.map((pkg) => (
                <Card
                  key={pkg.id}
                  accented={selectedId === pkg.id}
                  padding="$md"
                  gap="$xs"
                  onPress={() => setSelectedId(pkg.id)}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="baseline" gap="$xs">
                      <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBold" fontWeight="700">
                        {pkg.title}
                      </Text>
                      <Text color="$textPrimary" fontFamily="$body" fontSize="$bodyBase" fontWeight="700">
                        {pkg.priceLabel}
                      </Text>
                    </XStack>
                    {pkg.recommended ? (
                      <Text color="$tertiary" fontFamily="$body" fontSize="$caption" fontWeight="700">
                        BEST VALUE
                      </Text>
                    ) : null}
                  </XStack>
                  <Text color="$placeholderColor" fontFamily="$body" fontSize="$caption">
                    {pkg.period}
                    {pkg.trialDays ? ` · ${pkg.trialDays}-day free trial` : ''}
                  </Text>
                </Card>
              ))}
            </YStack>

            {error ? (
              <Text color="$secondary" fontFamily="$body" fontSize="$caption">
                {error}
              </Text>
            ) : null}

            <PrimaryButton
              label={isSubmitting ? 'Please wait...' : 'Subscribe'}
              onPress={isSubmitting ? undefined : handleSubscribe}
            />
            <Text
              color="$placeholderColor"
              fontFamily="$body"
              fontSize="$bodyBase"
              textAlign="center"
              onPress={isSubmitting ? undefined : handleRestore}>
              Restore Purchases
            </Text>
          </>
        )}
      </YStack>
    </SafeAreaView>
  );
}
