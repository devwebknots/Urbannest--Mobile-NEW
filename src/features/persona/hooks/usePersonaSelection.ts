/**
 * usePersonaSelection: ViewModel for the persona carousel.
 * Tracks the centered card, builds the CTA copy, and handles navigation.
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { navigationRef } from '@/navigation/navigationRef';
import { PERSONA_SLIDES } from '../constants';
import type { PersonaSlide } from '../types';

export interface PersonaNavigation {
  replace: (route: 'Home') => void;
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

  const goHome = useCallback(() => {
    if (navigation?.replace) {
      navigation.replace('Home');
    } else if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [navigation]);

  const select = useCallback(
    (index: number) => {
      const slide = PERSONA_SLIDES[index];
      if (!slide) {
        return;
      }
      if (slide.kind === 'add') {
        Alert.alert(
          'Add a persona',
          'Adding new roles is coming soon. Contact support to unlock one today.',
        );
        return;
      }
      if (slide.persona.status === 'inactive') {
        Alert.alert(
          `${slide.persona.title} is inactive`,
          'We have noted your request. You will be notified once this profile is activated.',
        );
        return;
      }
      goHome();
    },
    [goHome],
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
