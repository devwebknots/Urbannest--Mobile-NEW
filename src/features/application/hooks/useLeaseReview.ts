/**
 * useLeaseReview: the "Lease Document" page, opened from the Lease Review
 * journey step on Application Details once the offer is accepted. Builds
 * the lease paper (landlord, tenant, premises, terms table) from the
 * offer, the application and the applicant's answers; handles the file
 * actions (download, share, full screen) and the renter's answer:
 * Confirm (-> journey moves on to Lease Agreement) or Dispute.
 * Sample lease until leases come from the API.
 */

import { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import {
  APPLICATION_LEASE,
  APPLICATION_OFFER,
  APPLICATION_PETS,
  APPLICATION_PREFILL,
} from '../constants';
import { journeyStore } from '../store/journeyStore';
import type { ApplicationRecord, DocumentPaperModel } from '../types';

export interface LeaseReviewNavigation {
  goBack: () => void;
  navigate?: (
    route: 'OfferAcceptance',
    params: { record: ApplicationRecord; accepted?: boolean },
  ) => void;
}

/** 1500 -> "$1,500.00" */
const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FILE_NAME = 'Lease_Agreement.pdf';

export function useLeaseReview(record: ApplicationRecord, navigation?: LeaseReviewNavigation) {
  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const [fullScreen, setFullScreen] = useState(false);
  const offer = APPLICATION_OFFER;
  const lease = APPLICATION_LEASE;

  const document = useMemo<DocumentPaperModel>(() => {
    const a = APPLICATION_PREFILL;
    const tenant = [a.firstName, a.middleName, a.lastName].filter(Boolean).join(' ');
    const tenantAddress = [a.street1, a.street2, `${a.city}, ${a.stateId} ${a.zip}`]
      .filter(Boolean)
      .join(', ');
    const premises = [record.propertyName, record.address, offer.address]
      .filter(Boolean)
      .join(' • ');

    return {
      heading: 'Residential Lease Agreement',
      intro: 'This lease is made between the landlord and the tenant named below.',
      notes: [
        'Please review every term before you confirm this lease.',
        'If anything needs to change, send a dispute to the owner.',
      ],
      certify:
        'The landlord agrees to rent, and the tenant agrees to lease, the premises described below.',
      party: { title: 'Tenant: Name & Address', name: tenant, address: tenantAddress },
      contacts: [
        { label: 'Landlord', value: lease.landlord },
        { label: 'Telephone Number', value: lease.landlordPhone },
        { label: 'Email', value: lease.landlordEmail },
      ],
      subject: { title: 'Premises and unit to which this lease applies:', value: premises },
      columns: ['Term', 'Details', 'Included'],
      sections: [
        {
          id: 'term',
          section: 'Section 1',
          title: 'Lease Term',
          lines: [
            `Start: ${offer.startDate}`,
            `Move-in: ${offer.moveInDate}`,
            `${offer.durationMonths} months`,
          ],
          checks: ['Fixed term'],
        },
        {
          id: 'rent',
          section: 'Section 2',
          title: 'Rent & Deposit',
          lines: [
            `Rent: ${money(offer.rent)} / month`,
            `Deposit: ${money(offer.securityDeposit)}`,
            `Due at signing: ${money(offer.oneTimePayment)}`,
          ],
          checks: ['Monthly rent', 'Deposit'],
        },
        {
          id: 'occupants',
          section: 'Section 3',
          title: 'Occupants & Pets',
          lines: [`Occupants: ${a.occupants}`, `Pets: ${APPLICATION_PETS.length}`],
          checks: ['Pets allowed'],
        },
        {
          id: 'upkeep',
          section: 'Section 4',
          title: 'Utilities & Upkeep',
          lines: ['Water & trash: landlord', 'Electricity & internet: tenant'],
          checks: ['Maintenance'],
        },
      ],
      closingTitle: 'TERMS / CONDITIONS:',
      closing:
        'Rent is due on the first day of each month. The security deposit is held for the length of the lease and returned, less any lawful deductions, after the tenant moves out. The tenant keeps the premises clean and in good condition and reports any repairs through the app. The landlord handles structural repairs and building systems. Neither party may change these terms without the other’s written agreement. Either party may end the lease early only as allowed by local law.',
      footer: [
        lease.landlord.toUpperCase(),
        'LEASING OFFICE',
        lease.landlordAddress.toUpperCase(),
        `APPLICATION #${record.id}`,
      ],
    };
  }, [lease, offer, record]);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  // No file storage in the app yet: say so instead of pretending to save
  const download = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Download',
        reference: FILE_NAME,
        message:
          'Downloads will be available once your documents are synced. Use Share to send your lease details for now.',
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [showDialog],
  );

  const share = useCallback(() => {
    Share.share({
      title: FILE_NAME,
      message: `Lease for ${record.propertyName}: ${money(offer.rent)} / month, ${offer.durationMonths} months from ${offer.startDate}.`,
    }).catch(() => {});
  }, [offer, record]);

  const confirm = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Confirm this lease?',
        reference: record.propertyName,
        message: 'You agree to the lease terms as written. The owner will then prepare the final lease agreement.',
        details: [
          { label: 'Rent', value: `${money(offer.rent)} / month` },
          { label: 'Term', value: `${offer.durationMonths} months` },
        ],
        actions: [
          {
            label: 'Confirm Lease',
            variant: 'brand',
            // Swap to the success card in place (no close + reopen)
            next: true,
            onPress: () => {
              // Application Details moves its journey on to Lease Agreement
              journeyStore.complete(record.id, 'review');
              showDialog({
                tone: 'success',
                title: 'Lease Confirmed',
                reference: `Application #${record.id}`,
                message: 'The owner has been notified and will share the final lease agreement soon.',
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

  const dispute = useCallback(
    () =>
      showDialog({
        tone: 'warning',
        title: 'Dispute this lease?',
        message:
          'We’ll let the owner know you need changes. They’ll contact you to go over the terms.',
        actions: [
          {
            label: 'Send Dispute',
            variant: 'danger',
            next: true,
            onPress: () =>
              showDialog({
                tone: 'success',
                title: 'Dispute Sent',
                reference: `Application #${record.id}`,
                message: 'The owner will review your request and get back to you.',
                dismissible: false,
                actions: [{ label: 'Done', variant: 'brand', onPress: back }],
              }),
          },
          { label: 'Cancel', variant: 'link' },
        ],
      }),
    [back, record, showDialog],
  );

  const openOffer = useCallback(() => {
    const params = { record, accepted: true };
    if (navigation?.navigate) {
      navigation.navigate('OfferAcceptance', params);
    } else {
      navigate('OfferAcceptance', params);
    }
  }, [navigation, record]);

  const more = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: record.propertyName,
        reference: FILE_NAME,
        message: 'See the offer you accepted for this lease.',
        actions: [
          { label: 'View Offer', variant: 'brand', onPress: openOffer },
          { label: 'Close', variant: 'link' },
        ],
      }),
    [openOffer, record, showDialog],
  );

  return {
    record,
    fileName: FILE_NAME,
    fileSize: lease.fileSize,
    document,
    back,
    more,
    download,
    share,
    confirm,
    dispute,
    fullScreen,
    openFullScreen: () => setFullScreen(true),
    closeFullScreen: () => setFullScreen(false),
    dialog: dialog.props,
  };
}
