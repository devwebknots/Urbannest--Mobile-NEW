/**
 * useOfferAcceptance: the "Offer Acceptance" page, opened from the Offer
 * Acceptance journey step on Application Details. Lease information
 * (start, move-in, duration) and payment lines from the owner's offer,
 * and the renter's answer: Accept (confirm -> success) or Reject (warning
 * confirm). Either answer returns to Application Details.
 * Sample offer until offers come from the API; the answer isn't saved yet.
 */

import { useCallback, useMemo } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import { APPLICATION_OFFER } from '../constants';
import { journeyStore } from '../store/journeyStore';
import type { ApplicationIconName, ApplicationRecord } from '../types';

export interface OfferAcceptanceNavigation {
  goBack: () => void;
}

export interface LeaseFact {
  readonly id: string;
  readonly icon: ApplicationIconName;
  readonly label: string;
  readonly value: string;
}

export interface PaymentLine {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  /** The highlighted total row ("One Time Payment") */
  readonly highlight?: boolean;
}

/** 1500 -> "$ 1,500.00" (the design's spacing after $) */
const money = (n: number) =>
  `$ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function useOfferAcceptance(
  record: ApplicationRecord,
  navigation?: OfferAcceptanceNavigation,
) {
  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const offer = APPLICATION_OFFER;

  const leaseFacts = useMemo<LeaseFact[]>(
    () => [
      { id: 'start', icon: 'calendar', label: 'Start Date', value: offer.startDate },
      { id: 'movein', icon: 'calendar', label: 'Move-in Date', value: offer.moveInDate },
      { id: 'duration', icon: 'clock', label: 'Duration', value: `${offer.durationMonths} Months` },
    ],
    [offer],
  );

  const payments = useMemo<PaymentLine[]>(
    () => [
      { id: 'rent', label: 'Rent Amount', value: money(offer.rent) },
      { id: 'deposit', label: 'Security Deposit', value: money(offer.securityDeposit) },
      {
        id: 'once',
        label: 'One Time Payment',
        value: money(offer.oneTimePayment),
        highlight: true,
      },
    ],
    [offer],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const accept = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Accept this offer?',
        reference: record.propertyName,
        message: 'You’re agreeing to the lease terms below. Next, you’ll review your lease.',
        details: [
          { label: 'Rent', value: `${money(offer.rent)} / month` },
          { label: 'Due now', value: money(offer.oneTimePayment) },
        ],
        actions: [
          {
            label: 'Accept Offer',
            variant: 'brand',
            // Swap to the success card in place (no close + reopen)
            next: true,
            onPress: () => {
              // Application Details moves its journey on to Lease Review
              journeyStore.complete(record.id, 'offer');
              showDialog({
                tone: 'success',
                title: 'Offer Accepted',
                reference: `Application #${record.id}`,
                message: 'The owner has been notified. Your lease will be ready for review soon.',
                dismissible: false,
                actions: [{ label: 'Done', variant: 'brand', onPress: back }],
              });
            },
          },
          { label: 'Cancel', variant: 'link' },
        ],
      }),
    [back, offer, record, showDialog],
  );

  const reject = useCallback(
    () =>
      showDialog({
        tone: 'warning',
        title: 'Reject this offer?',
        message: `You won’t be able to lease ${record.propertyName} with this application.`,
        actions: [
          { label: 'Reject Offer', variant: 'danger', onPress: back },
          { label: 'Cancel', variant: 'link' },
        ],
      }),
    [back, record, showDialog],
  );

  return {
    record,
    offer,
    leaseFacts,
    payments,
    back,
    accept,
    reject,
    dialog: dialog.props,
  };
}
