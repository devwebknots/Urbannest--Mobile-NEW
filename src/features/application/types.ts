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

export interface ChoiceOption {
  readonly id: string;
  readonly label: string;
}

/** What the add / edit sheet is doing */
export type PersonSheetState =
  | { kind: 'coApplicant' }
  | { kind: 'dependent'; editId?: string }
  | null;
