/**
 * useSubmittedApplication: the "Submitted Application" page, opened by
 * "View" on the Application Submitted journey step. Builds the lease
 * application document (file name, size, the paper's sections) from the
 * application record and the applicant's answers, and handles the file
 * actions: download, share, full screen.
 * Sample data until applications come from the API.
 */

import { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import {
  APPLICATION_CONSENTS,
  APPLICATION_PREFILL,
  APPLICATION_VEHICLES,
  APPLICATION_PETS,
  PHONE_COUNTRIES,
} from '../constants';
import type { ApplicationRecord, DocumentPaperModel } from '../types';

export interface SubmittedApplicationNavigation {
  goBack: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** MM/DD/YYYY -> "Dec 16, 2024" */
const longDate = (mdY: string) => {
  const [m, d, y] = mdY.split('/').map(Number);
  return m && d && y ? `${MONTHS[m - 1]} ${d}, ${y}` : mdY;
};

/** Sample file size until the real PDF exists */
const FILE_SIZE = 'PDF • 1.2 MB';

export function useSubmittedApplication(
  record: ApplicationRecord,
  navigation?: SubmittedApplicationNavigation,
) {
  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const [fullScreen, setFullScreen] = useState(false);
  const submittedOn = longDate(record.appliedOn);
  const fileName = 'Lease_Application.pdf';

  const document = useMemo<DocumentPaperModel>(() => {
    const a = APPLICATION_PREFILL;
    const dial = PHONE_COUNTRIES.find(c => c.id === a.countryId)?.dialCode ?? '';
    const name = [a.firstName, a.middleName, a.lastName].filter(Boolean).join(' ');
    const address = [a.street1, a.street2, `${a.city}, ${a.stateId} ${a.zip}`]
      .filter(Boolean)
      .join(', ');
    const property = [record.propertyName, record.address, record.unit].filter(Boolean).join(' • ');

    return {
      heading: 'Standard Application for Lease',
      intro: 'This application was completed and submitted electronically by the applicant.',
      notes: [
        'Information is as provided by the applicant at the time of submission.',
        'Changes after submission must be requested through the leasing office.',
      ],
      certify: 'This is to certify that the applicant, named below, has applied as described below.',
      party: { title: 'Applicant: Name & Address', name, address },
      contacts: [
        { label: 'Telephone Number', value: `${dial} ${a.phone}`.trim() },
        { label: 'Email', value: a.email },
      ],
      subject: { title: 'Property and unit to which this application applies:', value: property },
      columns: ['Section', 'Details', 'Provided'],
      sections: [
        {
          id: 's1',
          section: 'Section 1',
          title: 'Applicant & Household',
          lines: [`Occupants: ${a.occupants}`, `Move-in: ${a.moveInDate}`],
          checks: ['Applicant', 'Household'],
        },
        {
          id: 's2',
          section: 'Section 2',
          title: 'Residence & Employment',
          lines: ['Residence history', 'Employment & income'],
          checks: ['Residence', 'Income'],
        },
        {
          id: 's3',
          section: 'Section 3',
          title: 'Documents & Lifestyle',
          lines: [
            `Pets: ${APPLICATION_PETS.length}`,
            `Vehicles: ${APPLICATION_VEHICLES.length}`,
          ],
          checks: ['ID & Proofs'],
        },
        {
          id: 's4',
          section: 'Section 4',
          title: 'Review & Consent',
          lines: [`Signed electronically on ${submittedOn}`],
          checks: ['Consents'],
        },
      ],
      closingTitle: 'DECLARATION / CONSENTS:',
      closing: APPLICATION_CONSENTS.map(c => c.text).join(' '),
      footer: [
        record.propertyName.toUpperCase(),
        'LEASING OFFICE',
        `APPLICATION #${record.id}`,
        `SUBMITTED ${submittedOn.toUpperCase()}`,
      ],
    };
  }, [record, submittedOn]);

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
        reference: fileName,
        message:
          "Downloads will be available once your documents are synced. Use Share to send your application details for now.",
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [showDialog],
  );

  const share = useCallback(() => {
    Share.share({
      title: fileName,
      message: `Lease application #${record.id} for ${record.propertyName}, submitted ${submittedOn}.`,
    }).catch(() => {});
  }, [record, submittedOn]);

  return {
    record,
    fileName,
    fileSize: FILE_SIZE,
    document,
    back,
    download,
    share,
    fullScreen,
    openFullScreen: () => setFullScreen(true),
    closeFullScreen: () => setFullScreen(false),
    dialog: dialog.props,
  };
}
