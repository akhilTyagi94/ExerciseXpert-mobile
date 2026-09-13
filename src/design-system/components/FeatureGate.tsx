import type { ReactNode } from 'react';

import type { FeatureKey } from '@/domain/entitlements';
import { useEntitlement } from '@/hooks/useEntitlement';

// The one reusable gating point (architecture proposal §10) — screens ask
// "does the viewer have this feature" via a single component instead of
// each reimplementing its own `isPremium` check.
export function FeatureGate({
  feature,
  fallback,
  children,
}: {
  feature: FeatureKey;
  fallback: ReactNode;
  children: ReactNode;
}) {
  const hasAccess = useEntitlement(feature);
  return <>{hasAccess ? children : fallback}</>;
}
