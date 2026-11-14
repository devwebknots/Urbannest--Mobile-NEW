/**
 * usePersonaSelection: ViewModel for the persona carousel.
 * Tracks the centered card, builds the CTA copy, and handles navigation.
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { navigationRef } from '@/navigation/navigationRef';
import { PERSONA_SLIDES } from '../constants';
import type { PersonaSlide } from '../types';

/** Where each active persona lands after "Continue". */
export type PersonaRoute = 'Home' | 'RenterHome' | 'LandlordHome';

export const ROUTE_FOR_PERSONA: Record<string, PersonaRoute> = {
  renter: 'RenterHome',
  landlord: 'LandlordHome',
};

export interface PersonaNavigation {
  replace: (route: PersonaRoute) => void;
  /** Opens the Add Persona page */
  navigate?: (route: 'AddPersona') => void;
}

export interface PersonaSelection {
  slides: readonly PersonaSlide[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  ctaLabel: string;
  /** Act on a card (the centered one, or the CTA) */
  select: (index: number) => void;
  onContinue: () => void;
}

export function usePersonaSelection(
  navigation?: PersonaNavigation,
): PersonaSelection {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (route: PersonaRoute) => {
      if (navigation?.replace) {
        navigation.replace(route);
      } else if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: route }] });
      }
    },
    [navigation],
  );

  const select = useCallback(
    (index: number) => {
      const slide = PERSONA_SLIDES[index];
      if (!slide) {
        return;
      }
      if (slide.kind === 'add') {
        if (navigation?.navigate) {
          navigation.navigate('AddPersona');
        } else if (navigationRef.isReady()) {
          navigationRef.navigate('AddPersona');
        }
        return;
      }
      if (slide.persona.status === 'inactive') {
        Alert.alert(
          `${slide.persona.title} is inactive`,
          'We have noted your request. You will be notified once this profile is activated.',
        );
        return;
      }
      goTo(ROUTE_FOR_PERSONA[slide.persona.id] ?? 'Home');
    },
    [goTo, navigation],
  );

  const onContinue = useCallback(
    () => select(activeIndex),
    [select, activeIndex],
  );

  const active = PERSONA_SLIDES[activeIndex];
  let ctaLabel = 'Add a persona';
  if (active?.kind === 'persona') {
    ctaLabel =
      active.persona.status === 'active'
        ? `Continue as ${active.persona.ctaName ?? active.persona.title}`
        : 'Request activation';
  }

  return {
    slides: PERSONA_SLIDES,
    activeIndex,
    setActiveIndex,
    ctaLabel,
    select,
    onContinue,
  };
}
