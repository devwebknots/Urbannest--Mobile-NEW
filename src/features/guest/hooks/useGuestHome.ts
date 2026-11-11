/**
 * useGuestHome: state and actions for the guest home page.
 */

import { useCallback, useState } from 'react';
import { navigationRef } from '@/navigation/navigationRef';
import type { ListingMode } from '../types';

export interface GuestNavigation {
  navigate: {
    (route: 'PersonaSelect'): void;
    (route: 'PropertyDetails', params: { propertyId: string }): void;
  };
}

export function useGuestHome(navigation?: GuestNavigation) {
  const [mode, setMode] = useState<ListingMode>('rent');
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(['f2']),
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Log In / Sign Up starts the persona picker
  const goToSignIn = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate('PersonaSelect');
    } else if (navigationRef.isReady()) {
      navigationRef.navigate('PersonaSelect' as never);
    }
  }, [navigation]);

  // Any listing card opens its details page
  const openProperty = useCallback(
    (propertyId: string) => {
      if (navigation?.navigate) {
        navigation.navigate('PropertyDetails', { propertyId });
      } else if (navigationRef.isReady()) {
        navigationRef.navigate('PropertyDetails', { propertyId });
      }
    },
    [navigation],
  );

  return { mode, setMode, favorites, toggleFavorite, goToSignIn, openProperty };
}
