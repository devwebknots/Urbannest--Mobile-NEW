/**
 * Global Navigation Container Ref
 * Allows non-React contexts (services, middleware) to trigger navigation if needed.
 */

import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [screen: RouteName] | [screen: RouteName, params: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
): void {
  if (navigationRef.isReady()) {
    // @ts-expect-error navigationRef strict tuple typing
    navigationRef.navigate(...args);
  }
}

export function goBack(): void {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
