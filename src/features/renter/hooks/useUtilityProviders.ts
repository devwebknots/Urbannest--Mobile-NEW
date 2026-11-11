/**
 * useUtilityProviders: ViewModel for one utility's providers page
 * (information only). Tapping a phone number calls it; tapping a website
 * opens the browser. If the device can't, an AppDialog explains it.
 */

import { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import { RENTER_PROFILE, RESIDENCES, UTILITIES } from '../constants';

export interface UtilityProvidersNavigation {
  goBack: () => void;
}

export function useUtilityProviders(
  residenceId?: string,
  utilityId?: string,
  navigation?: UtilityProvidersNavigation,
) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const utility = useMemo(
    () => UTILITIES.find(u => u.id === utilityId) ?? UTILITIES[0],
    [utilityId],
  );
  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const open = useCallback(
    (url: string, what: string) => {
      Linking.openURL(url).catch(() =>
        showDialog({
          tone: 'warning',
          title: `Can't open ${what}`,
          message: 'This device could not open it. You can copy the details from this page instead.',
          actions: [{ label: 'OK', variant: 'brand' }],
        }),
      );
    },
    [showDialog],
  );

  /** Dials a number like "(314) 555-0142" */
  const call = useCallback(
    (phone: string) => open(`tel:${phone.replace(/[^\d+]/g, '')}`, 'the phone app'),
    [open],
  );
  const openWebsite = useCallback((url: string) => open(url, 'the website'), [open]);

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
    utility,
    call,
    openWebsite,
    back,
    openProfile,
    dialog: dialog.props,
  };
}
