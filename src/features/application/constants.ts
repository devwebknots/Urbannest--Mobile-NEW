/**
 * Rental application content, from the "Rental Application" design.
 * The form starts filled with the design's sample applicant (mock profile
 * until the account API provides it).
 */

import type {
  ApplicantForm,
  ApplicationDocument,
  ApplicationStep,
  ApplicationFilterId,
  ApplicationIconName,
  ApplicationRecord,
  ApplicationStatusId,
  ConsentItem,
  Pet,
  Vehicle,
  ChoiceOption,
  EmploymentForm,
  ResidenceForm,
  CoApplicant,
  Dependent,
  PhoneCountry,
} from './types';
import { renterAssets } from '@/features/renter/assets/renterAssets';
import { applicationAssets } from './assets/applicationAssets';

export const APPLICATION_STEPS: readonly ApplicationStep[] = [
  {
    id: 'household',
    label: 'Applicant & Household',
    title: 'Applicant & Household',
    subtitle: 'Provide your personal, household, and move-in details to continue.',
    icon: 'user',
  },
  {
    id: 'history',
    label: 'History',
    title: 'Rental & Financial History',
    subtitle: 'Document your past residences and your current income.',
    icon: 'house',
  },
  {
    id: 'documents',
    label: 'Documents',
    title: 'Property Requirements & Documents',
    subtitle: 'Upload your documents and tell us about pets, vehicles and storage.',
    icon: 'document',
  },
  {
    id: 'submit',
    label: 'Submission',
    title: 'Review, Consent & Submit',
    subtitle: 'Carefully review your information, then provide consent to submit.',
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

/* ---- Step 2: Rental & Financial History ---- */

/** "How did you hold this residence?" */
export const RESIDENCE_HOLD_TYPES: readonly ChoiceOption[] = [
  { id: 'rented', label: 'Rented' },
  { id: 'owned', label: 'Owned' },
  { id: 'family', label: 'Lived with family / friends' },
  { id: 'company', label: 'Company / student housing' },
  { id: 'other', label: 'Other' },
];

export const EMPLOYMENT_STATUSES: readonly ChoiceOption[] = [
  { id: 'fullTime', label: 'Employed full-time' },
  { id: 'partTime', label: 'Employed part-time' },
  { id: 'self', label: 'Self-employed' },
  { id: 'student', label: 'Student' },
  { id: 'retired', label: 'Retired' },
  { id: 'unemployed', label: 'Not employed' },
];

/** Statuses that ask for employer, job title and dates */
export const EMPLOYED_STATUS_IDS: readonly string[] = ['fullTime', 'partTime', 'self'];

export const EMPTY_RESIDENCE: ResidenceForm = {
  holdType: '',
  street1: '',
  street2: '',
  city: '',
  stateId: '',
  zip: '',
  landlordName: '',
  landlordContact: '',
  startDate: '',
  endDate: '',
  rent: '',
  reason: '',
};

export const EMPTY_EMPLOYMENT: EmploymentForm = {
  status: '',
  income: '',
  employer: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
};

/* ---- Step 3: Property Requirements & Documents ---- */

/** Document slots; the design's first two come already uploaded */
export const APPLICATION_DOCUMENTS: readonly ApplicationDocument[] = [
  {
    id: 'id',
    title: 'Government-Issued Identification',
    hint: "Driver's License, Passport, or State ID",
    icon: 'idCard',
    required: true,
    fileName: 'ID_Proof.pdf',
  },
  {
    id: 'income',
    title: 'Proof of Income',
    hint: 'Pay stub, bank statement, etc.',
    icon: 'coins',
    required: true,
    fileName: 'Paystub_Aug.pdf',
  },
  {
    id: 'employment',
    title: 'Employment Verification',
    hint: 'Upload employment letter or verification.',
    icon: 'briefcase',
    required: false,
  },
  {
    id: 'other',
    title: 'Other Requested Document',
    hint: 'Any additional document.',
    icon: 'document',
    required: false,
  },
];

export const PET_TYPES: readonly string[] = ['Dog', 'Cat', 'Bird', 'Other'];

/** The design's pet and vehicle */
export const APPLICATION_PETS: readonly Pet[] = [
  { id: 'pet1', type: 'Dog', breed: 'Labrador', weight: '30', photo: applicationAssets.petLabrador },
];

export const APPLICATION_VEHICLES: readonly Vehicle[] = [
  { id: 'car1', model: 'Toyota Camry', plate: 'MO-1234' },
];

export const STORAGE_OPTIONS: readonly ChoiceOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

/* ---- Step 4: Review, Consent & Submit ---- */

/** Screening summary (the design's sample values) */
export const SCREENING_SUMMARY = {
  vendors: 'Experian, TransUnion, National Registry',
  scope: 'Credit, background & rental history',
  tier: 'Tier 1 Rating (Sample)',
};

/** Application fee lines; negative = credit */
export const APPLICATION_FEES: readonly { label: string; amount: number }[] = [
  { label: 'Institutional Underwriting & Screening', amount: 150 },
  { label: 'Corporate Partner Subsidy', amount: -150 },
];

export const APPLICATION_CONSENTS: readonly ConsentItem[] = [
  {
    id: 'truth',
    title: 'Truth & Accuracy Attestation',
    text: 'I declare that all statements, disclosures, and uploaded documents provided in this application are true, accurate, and complete.',
    required: true,
  },
  {
    id: 'screening',
    title: 'Background & Credit Screening Authorization',
    text: 'I authorize the applicable landlord/property manager to conduct background and credit screening as permitted by law.',
    required: true,
  },
  {
    id: 'privacy',
    title: 'Privacy & Data Processing Consent',
    text: 'I consent to UrbanNest processing my personal information for the purpose of this rental application.',
    required: true,
  },
  {
    id: 'electronic',
    title: 'Electronic Communication Consent',
    text: 'I agree to receive application-related communications electronically.',
    required: false,
  },
];

/* ---- Application Status page ---- */

/**
 * Status look (app status colours, as on Maintenance tickets: blue = in
 * progress, green = good, amber = waiting, red = problem, grey = draft)
 */
export const APPLICATION_STATUS_META: Record<
  ApplicationStatusId,
  { label: string; icon: ApplicationIconName; accent: 'grey' | 'blue' | 'green' | 'amber' | 'red'; filter: ApplicationFilterId }
> = {
  submitted: { label: 'Submitted', icon: 'send', accent: 'blue', filter: 'progress' },
  draft: { label: 'Draft', icon: 'document', accent: 'grey', filter: 'draft' },
  lease: { label: 'Lease Generation\nIn Progress', icon: 'refresh', accent: 'green', filter: 'progress' },
  verification: { label: 'Verification\nIn Progress', icon: 'refresh', accent: 'blue', filter: 'progress' },
  approved: { label: 'Approved', icon: 'circleCheck', accent: 'green', filter: 'approved' },
  waiting: { label: 'Waiting List', icon: 'clock', accent: 'amber', filter: 'waiting' },
  rejected: { label: 'Rejected', icon: 'circleX', accent: 'red', filter: 'rejected' },
  incomplete: { label: 'Incomplete', icon: 'circleAlert', accent: 'red', filter: 'incomplete' },
};

export const APPLICATION_FILTERS: readonly {
  id: ApplicationFilterId;
  label: string;
  icon?: ApplicationIconName;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft', icon: 'document' },
  { id: 'progress', label: 'In Progress', icon: 'refresh' },
  { id: 'approved', label: 'Approved', icon: 'circleCheck' },
  { id: 'waiting', label: 'Waiting List', icon: 'clock' },
  { id: 'rejected', label: 'Rejected', icon: 'circleX' },
  { id: 'incomplete', label: 'Incomplete', icon: 'circleAlert' },
];

/** The design's sample applications (mock until the API lists them) */
export const APPLICATION_RECORDS: readonly ApplicationRecord[] = [
  { id: 'AHC12895', propertyName: 'Maple Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'draft', image: renterAssets.sterling, propertyId: 'r1' },
  { id: 'AHC12896', propertyName: 'High Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'lease', image: renterAssets.obsidian },
  { id: 'ABC123456', propertyName: 'Green View', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '01/05/2025', status: 'approved', image: renterAssets.azure },
  { id: 'AVF14568', propertyName: 'Grace Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/20/2024', status: 'verification', image: renterAssets.marble },
  { id: 'AGF25486', propertyName: 'Green View', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/20/2024', status: 'waiting', image: renterAssets.azure },
  { id: 'AHC12897', propertyName: 'Maple Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'rejected', image: renterAssets.sterling },
  { id: 'AHC12898', propertyName: 'Green View', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'incomplete', image: renterAssets.azure },
];
