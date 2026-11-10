/**
 * useUtilities: ViewModel for the move-in Utilities page (opened from the
 * Check-In "Utilities" tile). Lists the home's utilities; tapping one opens
 * its providers page. "Confirm Utilities" goes back to Check-In, which
 * ticks the Utilities tile.
 */

import { useCallback, useMemo } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import { RENTER_PROFILE, RESIDENCES, UTILITIES } from '../constants';
import type { UtilityService } from '../types';

export interface UtilitiesNavigation {
  goBack: () => void;
  /** React Navigation's object form: navigate({ name, params, merge }) */
  navigate?: (options: { name: string; params: object; merge?: boolean }) => void;
}

export function useUtilities(residenceId?: string, navigation?: UtilitiesNavigation) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const providerCount = useMemo(
    () => UTILITIES.reduce((sum, u) => sum + u.providers.length, 0),
    [],
  );

  const openUtility = useCallback(
    (utility: UtilityService) => {
      const params = { residenceId: residence.id, utilityId: utility.id };
      if (navigation?.navigate) {
        navigation.navigate({ name: 'UtilityProviders', params });
      } else {
        navigate('UtilityProviders', params);
      }
    },
    [navigation, residence.id],
  );

  // Back to Check-In, which ticks the Utilities tile
  const confirm = useCallback(() => {
    const params = { residenceId: residence.id, utilitiesConfirmed: true };
    if (navigation?.navigate) {
      navigation.navigate({ name: 'CheckIn', params, merge: true });
    } else {
      navigate('CheckIn', params);
    }
  }, [navigation, residence.id]);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const openProfile = useCallback(
    () => showDialog({ tone: 'info', title: 'Profile', message: 'Coming soon.', actions: [{ label: 'OK', variant: 'brand' }] }),
    [showDialog],
  );

  return {
    profile: RENTER_PROFILE,
    residence,
    utilities: UTILITIES,
    providerCount,
    openUtility,
    confirm,
    back,
    openProfile,
    dialog: dialog.props,
  };
}
