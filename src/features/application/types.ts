/**
 * Rental application model (step 1: Applicant & Household).
 */

import type { applicationIcons } from './assets/applicationAssets';

export type ApplicationIconName = keyof typeof applicationIcons;

export interface ApplicationStep {
  readonly id: string;
  readonly label: string;
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

/** What the add / edit sheet is doing */
export type PersonSheetState =
  | { kind: 'coApplicant' }
  | { kind: 'dependent'; editId?: string }
  | null;
