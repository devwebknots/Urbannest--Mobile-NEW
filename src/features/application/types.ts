/**
 * Rental application model (step 1: Applicant & Household).
 */

import type { applicationIcons } from './assets/applicationAssets';

export type ApplicationIconName = keyof typeof applicationIcons;

export interface ApplicationStep {
  readonly id: string;
  /** Short name in the stepper */
  readonly label: string;
  /** Page headline for the step */
  readonly title: string;
  /** Line under the page headline */
  readonly subtitle: string;
  /** Icon for the step's placeholder (steps not built yet) */
  readonly icon: ApplicationIconName;
}

/** Text fields of step 1, by key */
export interface ApplicantForm {
  firstName: string;
  middleName: string;
  lastName: string;
  /** DD/MM/YYYY */
  dateOfBirth: string;
  email: string;
  countryId: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateId: string;
  zip: string;
  /** DD/MM/YYYY */
  moveInDate: string;
  occupants: string;
}

export type ApplicantField = keyof ApplicantForm;

export interface PhoneCountry {
  readonly id: string;
  readonly label: string;
  readonly flag: string;
  readonly dialCode: string;
}

export interface CoApplicant {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly status: 'invited';
}

export interface Dependent {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
}

/** Step 2: one past / current residence being entered */
export interface ResidenceForm {
  holdType: string;
  street1: string;
  street2: string;
  city: string;
  stateId: string;
  zip: string;
  landlordName: string;
  landlordContact: string;
  /** DD/MM/YYYY */
  startDate: string;
  /** DD/MM/YYYY, blank = current home */
  endDate: string;
  /** Whole dollars, "1,850" */
  rent: string;
  reason: string;
}

export type ResidenceField = keyof ResidenceForm;

export interface Residence extends ResidenceForm {
  readonly id: string;
}

/** Step 2: current employment and income */
export interface EmploymentForm {
  status: string;
  /** Whole dollars, "85,000" */
  income: string;
  employer: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
}

export type EmploymentField = keyof EmploymentForm;

/** Step 3: one document slot ("Government-Issued Identification") */
export interface ApplicationDocument {
  readonly id: string;
  readonly title: string;
  readonly hint: string;
  readonly icon: ApplicationIconName;
  readonly required: boolean;
  /** Uploaded file, if any */
  readonly fileName?: string;
  readonly uri?: string;
}

export interface Pet {
  readonly id: string;
  readonly type: string;
  readonly breed: string;
  /** kg, as typed */
  readonly weight: string;
  /** Local photo (require id or uri) */
  readonly photo?: number | { uri: string };
}

export interface Vehicle {
  readonly id: string;
  readonly model: string;
  readonly plate: string;
}

/** What the step 3 add / edit sheet is doing */
export type LifestyleSheetState =
  | { kind: 'pet'; editId?: string }
  | { kind: 'vehicle'; editId?: string }
  | null;

/** Step 4: one consent checkbox */
export interface ConsentItem {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly required: boolean;
}

/** Application Status page */
export type ApplicationStatusId =
  | 'submitted'
  | 'draft'
  | 'lease'
  | 'verification'
  | 'approved'
  | 'waiting'
  | 'rejected'
  | 'incomplete';

/** Filter chips: several statuses can share one ("In Progress") */
export type ApplicationFilterId =
  | 'all'
  | 'draft'
  | 'progress'
  | 'approved'
  | 'waiting'
  | 'rejected'
  | 'incomplete';

export interface ApplicationRecord {
  readonly id: string;
  readonly propertyName: string;
  /** "Unit A 13.A • Room A1, A3" */
  readonly unit: string;
  /** MM/DD/YYYY */
  readonly appliedOn: string;
  readonly status: ApplicationStatusId;
  readonly image: number;
  /** Listing to reopen (drafts) */
  readonly propertyId?: string;
  /** Details page: line under the name, e.g. "Unit 402-B" */
  readonly address?: string;
  /** Details page: photo tag, e.g. "Single Family" */
  readonly category?: string;
  /** Details page: "A 13.A" (else read from `unit`) */
  readonly unitNo?: string;
  /** Details page: "A1, A3" (else read from `unit`) */
  readonly rooms?: string;
}

/** Application Details: one step of the "Application Journey" */
export interface JourneyStep {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly icon: ApplicationIconName;
  /** The renter does this step (accept, review, pay, sign): blinking arrow when current */
  readonly userAction?: boolean;
  /** Done card shows "View" (not for the review-only Application Status) */
  readonly viewable?: boolean;
}

export type JourneyState = 'done' | 'current' | 'upcoming';

/** Application Details: where an application is, by status */
export interface ApplicationProgress {
  /** Index of the current journey step */
  readonly step: number;
  /** "Current Status" card */
  readonly title: string;
  readonly message: string;
  /** Subtitle of the "Application Status" journey step */
  readonly statusDetail: string;
}

/** Offer Acceptance: the owner's lease offer for an approved application */
export interface LeaseOffer {
  /** Street address under the property name */
  readonly address: string;
  /** Tag beside the name, e.g. "Student Housing" */
  readonly category: string;
  /** MM/DD/YYYY */
  readonly startDate: string;
  /** MM/DD/YYYY */
  readonly moveInDate: string;
  readonly durationMonths: number;
  /** Whole dollars per month */
  readonly rent: number;
  readonly securityDeposit: number;
  /** Due when the offer is accepted */
  readonly oneTimePayment: number;
}

export interface ChoiceOption {
  readonly id: string;
  readonly label: string;
}

/** What the add / edit sheet is doing */
export type PersonSheetState =
  | { kind: 'coApplicant' }
  | { kind: 'dependent'; editId?: string }
  | null;
