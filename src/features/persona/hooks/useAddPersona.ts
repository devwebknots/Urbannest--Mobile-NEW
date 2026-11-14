/**
 * useAddPersona: ViewModel for the Add Persona page.
 * Tracks the chosen role, builds the button copy, and either opens a role
 * already on the account or sends a request for a new one (AppDialog
 * confirm -> success, then back to the persona carousel).
 */

import { useCallback, useMemo, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { navigationRef } from '@/navigation/navigationRef';
import { PERSONA_ROLES, PERSONA_SLIDES } from '../constants';
import type { PersonaRole } from '../types';
import { PersonaRoute, ROUTE_FOR_PERSONA } from './usePersonaSelection';

export interface AddPersonaNavigation {
  replace: (route: PersonaRoute) => void;
  goBack: () => void;
}

/** Persona ids that are active on the account (from the carousel). */
const ACTIVE_PERSONAS = new Set(
  PERSONA_SLIDES.flatMap(slide =>
    slide.kind === 'persona' && slide.persona.status === 'active'
      ? [slide.persona.id]
      : [],
  ),
);

export function isRoleAdded(role: PersonaRole): boolean {
  return role.personaId !== undefined && ACTIVE_PERSONAS.has(role.personaId);
}

export function useAddPersona(navigation?: AddPersonaNavigation) {
  const roles = PERSONA_ROLES;
  // Start on the first role that is not on the account yet
  const [selectedId, setSelectedId] = useState(
    () => (roles.find(r => !isRoleAdded(r)) ?? roles[0]).id,
  );
  const dialog = useAppDialog();
  const { show } = dialog;

  const selectedIndex = Math.max(
    0,
    roles.findIndex(r => r.id === selectedId),
  );
  const selected = roles[selectedIndex];
  const added = isRoleAdded(selected);
  const name = selected.ctaName ?? selected.title;
  const ctaLabel = added ? `Continue as ${name}` : `Add ${name}`;

  const goBack = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }, [navigation]);

  const open = useCallback(
    (route: PersonaRoute) => {
      if (navigation?.replace) {
        navigation.replace(route);
      } else if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: route }] });
      }
    },
    [navigation],
  );

  const showSent = useCallback(
    (role: PersonaRole) =>
      show({
        tone: 'success',
        title: 'Request sent',
        message: `We'll notify you as soon as your ${role.title} persona is ready.`,
        reference: `Request #PR-${4100 + PERSONA_ROLES.indexOf(role) * 37}`,
        details: [
          { label: 'Persona', value: role.title },
          { label: 'Review', value: role.review },
        ],
        dismissible: false,
        actions: [{ label: 'Done', variant: 'brand', onPress: goBack }],
      }),
    [show, goBack],
  );

  const onContinue = useCallback(() => {
    if (added && selected.personaId) {
      open(ROUTE_FOR_PERSONA[selected.personaId] ?? 'Home');
      return;
    }
    show({
      tone: 'info',
      title: `Add ${selected.title}?`,
      message:
        selected.id === 'admin'
          ? 'Admin access is approved by the UrbanNest team. We will check your staff details first.'
          : `We'll verify a few details, then the ${selected.title} profile joins this account.`,
      actions: [
        {
          label: 'Send request',
          variant: 'brand',
          next: true,
          onPress: () => showSent(selected),
        },
        { label: 'Cancel', variant: 'link' },
      ],
    });
  }, [added, selected, open, show, showSent]);

  const addedCount = useMemo(() => roles.filter(isRoleAdded).length, [roles]);

  return {
    roles,
    selected,
    selectedIndex,
    selectedAdded: added,
    addedCount,
    select: setSelectedId,
    ctaLabel,
    onContinue,
    goBack,
    dialog,
  };
}
