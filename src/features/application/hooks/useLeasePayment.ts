/**
 * useLeasePayment: the "Payment Summary" page, opened from the Payment
 * journey step on Application Details once the lease agreement is ready.
 * Payment lines (security deposit, one time payment) from the offer, the
 * total, tax and final amount, and "Proceed to Pay": confirm -> success
 * (journey moves on to Lease Signing). No payment provider yet: nothing is
 * charged. The property card opens the accepted offer.
 */

import { useCallback, useMemo } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import { APPLICATION_OFFER, LEASE_PAYMENT_TAX_RATE } from '../constants';
import { journeyStore } from '../store/journeyStore';
import type { ApplicationIconName, ApplicationRecord } from '../types';
import type { PaymentLine } from './useOfferAcceptance';

export interface LeasePaymentNavigation {
  goBack: () => void;
  navigate?: (
    route: 'OfferAcceptance',
    params: { record: ApplicationRecord; accepted?: boolean },
  ) => void;
}

export interface PaymentItem {
  readonly id: string;
  readonly icon: ApplicationIconName;
  readonly label: string;
  readonly value: string;
}

/** 1500 -> "$ 1,500.00" (the design's spacing after $) */
const money = (n: number) =>
  `$ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function useLeasePayment(record: ApplicationRecord, navigation?: LeasePaymentNavigation) {
  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const offer = APPLICATION_OFFER;

  const amounts = useMemo(() => {
    const subtotal = offer.securityDeposit + offer.oneTimePayment;
    const tax = Math.round(subtotal * LEASE_PAYMENT_TAX_RATE * 100) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [offer]);

  const items = useMemo<PaymentItem[]>(
    () => [
      { id: 'deposit', icon: 'layers', label: 'Security Deposit', value: money(offer.securityDeposit) },
      { id: 'once', icon: 'creditCard', label: 'One Time Payment', value: money(offer.oneTimePayment) },
    ],
    [offer],
  );

  // Total Summary: the last line is the highlighted strip (as on Offer Acceptance)
  const totals = useMemo<PaymentLine[]>(
    () => [
      { id: 'amount', label: 'Total Amount', value: money(amounts.subtotal) },
      {
        id: 'tax',
        label: `Tax (${Math.round(LEASE_PAYMENT_TAX_RATE * 100)}%)`,
        value: money(amounts.tax),
      },
      { id: 'final', label: 'Final Total Amount', value: money(amounts.total), highlight: true },
    ],
    [amounts],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const openOffer = useCallback(() => {
    const params = { record, accepted: true };
    if (navigation?.navigate) {
      navigation.navigate('OfferAcceptance', params);
    } else {
      navigate('OfferAcceptance', params);
    }
  }, [navigation, record]);

  const pay = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Confirm payment?',
        reference: record.propertyName,
        message: 'This completes your lease payment. Next, you’ll sign your lease.',
        details: [
          { label: 'Total', value: money(amounts.subtotal) },
          { label: 'Tax', value: money(amounts.tax) },
          { label: 'You pay', value: money(amounts.total) },
        ],
        actions: [
          {
            label: `Pay ${money(amounts.total)}`,
            variant: 'brand',
            // Swap to the success card in place (no close + reopen)
            next: true,
            onPress: () => {
              // Application Details moves its journey on to Lease Signing
              journeyStore.complete(record.id, 'payment');
              showDialog({
                tone: 'success',
                title: 'Payment Successful',
                reference: `Application #${record.id}`,
                message: 'Your lease payment is complete. Sign your lease to finish.',
                details: [{ label: 'Paid', value: money(amounts.total) }],
                dismissible: false,
                actions: [{ label: 'Done', variant: 'brand', onPress: back }],
              });
            },
          },
          { label: 'Cancel', variant: 'link' },
        ],
      }),
    [amounts, back, record, showDialog],
  );

  return {
    record,
    items,
    totals,
    back,
    openOffer,
    pay,
    dialog: dialog.props,
  };
}
