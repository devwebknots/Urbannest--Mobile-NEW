/**
 * useApplicationSubmitted: the "Application Submitted!" page after a rental
 * application is sent: the application ID, the "What Happens Next?"
 * steps (submitted done, review and decision pending), "Track Application
 * Status" (opens the Application Status list) and "Back to Home".
 */

import { useCallback, useMemo } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import type { TicketTimelineStep } from '@/features/renter/types';

export interface ApplicationSubmittedNavigation {
  goBack: () => void;
  navigate?: {
    (route: 'GuestHome'): void;
    (
      route: 'ApplicationStatus',
      params: { propertyId?: string; applicationId: string; submittedAt: number },
    ): void;
  };
}

/** "Today, 9:41 AM" / "Nov 12, 9:41 AM" */
export const submittedLabel = (time: number, now = Date.now()) => {
  const d = new Date(time);
  const clock = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const today = new Date(now).toDateString() === d.toDateString();
  return today
    ? `Today, ${clock}`
    : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${clock}`;
};

export function useApplicationSubmitted(
  params: { propertyId?: string; applicationId?: string; submittedAt?: number } | undefined,
  navigation?: ApplicationSubmittedNavigation,
) {
  const dialog = useAppDialog();
  const applicationId = params?.applicationId ?? 'UN-RA-10456';
  const submittedAt = params?.submittedAt ?? Date.now();

  const steps = useMemo<TicketTimelineStep[]>(
    () => [
      {
        id: 'submitted',
        title: 'Application Submitted',
        detail: 'Your details have been received.',
        time: submittedLabel(submittedAt),
        state: 'done',
      },
      {
        id: 'review',
        title: 'Under Review',
        detail: 'The property manager will review your application.',
        time: '',
        state: 'pending',
      },
      {
        id: 'decision',
        title: "You'll Be Notified",
        detail: "We'll update you once a decision is made.",
        time: '',
        state: 'pending',
      },
    ],
    [submittedAt],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const home = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate('GuestHome');
    } else {
      navigate('GuestHome');
    }
  }, [navigation]);

  /** "Track Application Status": the status list, this application on top */
  const track = useCallback(() => {
    const status = {
      propertyId: params?.propertyId,
      applicationId,
      submittedAt,
    };
    if (navigation?.navigate) {
      navigation.navigate('ApplicationStatus', status);
    } else {
      navigate('ApplicationStatus', status);
    }
  }, [applicationId, navigation, params?.propertyId, submittedAt]);

  return { applicationId, steps, back, home, track, dialog: dialog.props };
}
