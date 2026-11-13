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
  ApplicationProgress,
  ApplicationRecord,
  ApplicationStatusId,
  JourneyStep,
  LeaseOffer,
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
  { id: 'AHC12895', propertyName: 'Maple Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'draft', image: renterAssets.sterling, propertyId: 'r1', address: 'Unit 402-B', category: 'Single Family' },
  { id: 'AHC12896', propertyName: 'High Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'lease', image: renterAssets.obsidian, address: 'Unit 402-B', category: 'Single Family' },
  { id: 'ABC123456', propertyName: 'Green View', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '01/05/2025', status: 'approved', image: renterAssets.azure, address: 'Unit 402-B', category: 'Single Family' },
  { id: 'AVF14568', propertyName: 'Grace Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/20/2024', status: 'verification', image: renterAssets.marble, address: 'Unit 402-B', category: 'Single Family' },
  { id: 'AGF25486', propertyName: 'Green View', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/20/2024', status: 'waiting', image: renterAssets.azure, address: 'Unit 402-B', category: 'Single Family' },
  { id: 'AHC12897', propertyName: 'Maple Tower', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'rejected', image: renterAssets.sterling, address: 'Unit 402-B', category: 'Single Family' },
  { id: 'AHC12898', propertyName: 'Green View', unit: 'Unit A 13.A • Room A1, A3', appliedOn: '12/16/2024', status: 'incomplete', image: renterAssets.azure, address: 'Unit 402-B', category: 'Single Family' },
];

/* ---- Application Details page ---- */

/**
 * "Application Journey" (the design's steps; {date} = applied date).
 * userAction: the renter does it (blinking arrow when current, not a loader).
 * viewable: a done card shows "View" (the review step has nothing to view).
 */
export const APPLICATION_JOURNEY: readonly JourneyStep[] = [
  { id: 'submitted', title: 'Application Submitted', detail: 'Successfully received.', icon: 'circleCheck', viewable: true },
  { id: 'status', title: 'Application Status', detail: 'Reviewing your documents.', icon: 'fileSearch' },
  { id: 'offer', title: 'Offer Acceptance', detail: 'Accept the rental offer to proceed.', icon: 'handshake', userAction: true, viewable: true },
  { id: 'review', title: 'Lease Review', detail: 'Review the lease terms and details.', icon: 'eye', userAction: true, viewable: true },
  { id: 'agreement', title: 'Lease Agreement', detail: 'Final lease agreement will be shared.', icon: 'fileText', viewable: true },
  { id: 'payment', title: 'Payment', detail: 'Complete the required payments.', icon: 'wallet', userAction: true, viewable: true },
  { id: 'signing', title: 'Lease Signing', detail: 'Sign the lease digitally.', icon: 'signature', userAction: true, viewable: true },
  { id: 'movein', title: 'Move-in Details', detail: 'Get your move-in date and instructions.', icon: 'key', viewable: true },
];

/** After the renter accepts the offer: current step moves to Lease Review */
export const OFFER_ACCEPTED_PROGRESS: ApplicationProgress = {
  step: 3,
  title: 'Review Your Lease',
  message: 'You accepted the rental offer. Review the lease terms and details to continue.',
  statusDetail: 'Approved.',
};

const REVIEWING: ApplicationProgress = {
  step: 1,
  title: 'Reviewing Your Documents',
  message: "We're verifying the documents you submitted. You'll be notified once this step is complete.",
  statusDetail: 'Reviewing your documents.',
};

/** Current step + "Current Status" card per application status */
export const APPLICATION_PROGRESS: Record<ApplicationStatusId, ApplicationProgress> = {
  draft: {
    step: 0,
    title: 'Finish Your Application',
    message: 'Your application is saved as a draft. Complete the remaining steps and submit it.',
    statusDetail: 'Starts once you submit.',
  },
  submitted: REVIEWING,
  verification: REVIEWING,
  incomplete: {
    step: 1,
    title: 'Documents Needed',
    message: 'Some details or documents are missing. Update your application so the review can continue.',
    statusDetail: 'Action needed: missing documents.',
  },
  waiting: {
    step: 1,
    title: "You're on the Waiting List",
    message: "There's no unit free right now. We'll let you know as soon as one opens up.",
    statusDetail: 'On the waiting list.',
  },
  rejected: {
    step: 1,
    title: 'Application Not Approved',
    message: "This application wasn't approved. You can browse other homes and apply again.",
    statusDetail: 'Not approved.',
  },
  approved: {
    step: 2,
    title: 'Your Offer Is Ready',
    message: 'Your application was approved. Accept the rental offer to proceed.',
    statusDetail: 'Approved.',
  },
  lease: {
    step: 4,
    title: 'Preparing Your Lease',
    message: "Your lease agreement is being generated. We'll share it with you shortly.",
    statusDetail: 'Approved.',
  },
};

/* ---- Offer Acceptance page ---- */

/** The design's sample offer, until offers come from the API */
export const APPLICATION_OFFER: LeaseOffer = {
  address: '701 Treeside Ct, Aspen Grove, CO 81611',
  category: 'Student Housing',
  startDate: '12/20/2025',
  moveInDate: '12/19/2025',
  durationMonths: 12,
  rent: 1500,
  securityDeposit: 500,
  oneTimePayment: 500,
};
