/**
 * Rental application content, from the "Rental Application" design.
 * The form starts filled with the design's sample applicant (mock profile
 * until the account API provides it).
 */

import type {
  ApplicantForm,
  ApplicationStep,
  CoApplicant,
  Dependent,
  PhoneCountry,
} from './types';

export const APPLICATION_STEPS: readonly ApplicationStep[] = [
  {
    id: 'household',
    label: 'Applicant & Household',
    subtitle: 'Provide your personal, household, and move-in details to continue.',
    icon: 'user',
  },
  {
    id: 'history',
    label: 'History',
    subtitle: 'Tell us where you have lived and worked over the last few years.',
    icon: 'house',
  },
  {
    id: 'documents',
    label: 'Documents',
    subtitle: 'Upload your ID, proof of income and any other supporting documents.',
    icon: 'document',
  },
  {
    id: 'submit',
    label: 'Submission',
    subtitle: 'Review your details and send your application to the landlord.',
    icon: 'circleCheck',
  },
];

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { id: 'in', label: 'India (+91)', flag: '🇮🇳', dialCode: '+91' },
  { id: 'us', label: 'United States (+1)', flag: '🇺🇸', dialCode: '+1' },
  { id: 'ca', label: 'Canada (+1)', flag: '🇨🇦', dialCode: '+1' },
  { id: 'gb', label: 'United Kingdom (+44)', flag: '🇬🇧', dialCode: '+44' },
  { id: 'au', label: 'Australia (+61)', flag: '🇦🇺', dialCode: '+61' },
  { id: 'ae', label: 'United Arab Emirates (+971)', flag: '🇦🇪', dialCode: '+971' },
];

/** US states (id = postal code) for the State dropdown */
export const US_STATES: readonly { id: string; label: string }[] = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL',
  'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
  'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
  'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
].map(code => ({ id: code, label: code }));

export const OCCUPANT_OPTIONS: readonly { id: string; label: string }[] = [
  '1', '2', '3', '4', '5', '6', '7', '8',
].map(n => ({ id: n, label: n }));

export const DEPENDENT_RELATIONSHIPS: readonly string[] = [
  'Spouse / Partner',
  'Child',
  'Parent',
  'Other',
];

/** The design's sample applicant */
export const APPLICATION_PREFILL: ApplicantForm = {
  firstName: 'John',
  middleName: 'Adam',
  lastName: 'Doe',
  dateOfBirth: '01/01/1980',
  email: 'john.doe@urbannest.com',
  countryId: 'in',
  phone: '98765 43210',
  street1: '35 Spring Borough Ct',
  street2: '',
  city: 'Ofallon',
  stateId: 'MO',
  zip: '63368',
  moveInDate: '30/11/2026',
  occupants: '2',
};

export const APPLICATION_CO_APPLICANTS: readonly CoApplicant[] = [
  { id: 'co1', name: 'Anju', email: 'anju@gmail.com', status: 'invited' },
];

export const APPLICATION_DEPENDENTS: readonly Dependent[] = [
  { id: 'd1', name: 'Nan', relationship: 'Spouse / Partner' },
  { id: 'd2', name: 'Dinkan', relationship: 'Child' },
];
