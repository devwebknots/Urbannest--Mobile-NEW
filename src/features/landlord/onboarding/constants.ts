/**
 * Landlord onboarding ("Independent Landlord" registration) data.
 */

import { COUNTRIES_US_FIRST } from '@/config/countries';
import type { ApplicationStep } from '@/features/application/types';

export const ONBOARDING_STEPS: readonly ApplicationStep[] = [
  {
    id: 'personal',
    label: 'Personal Details',
    title: 'Personal Details',
    subtitle: 'Your basic information for landlord registration.',
    icon: 'user',
  },
  {
    id: 'address',
    label: 'Residential Address',
    title: 'Residential Address',
    subtitle: 'Where you currently live.',
    icon: 'house',
  },
  {
    id: 'identity',
    label: 'Identity Verification',
    title: 'Identity Verification',
    subtitle: 'Verify your identity with a valid government ID.',
    icon: 'idCard',
  },
];

/** Every country (United States first, then A–Z); the picker has search */
export const ONBOARDING_COUNTRIES = COUNTRIES_US_FIRST;

export const ID_TYPES: readonly { id: string; label: string }[] = [
  { id: 'passport', label: 'Passport' },
  { id: 'driving', label: "Driver's License" },
  { id: 'stateId', label: 'State ID Card' },
  { id: 'nationalId', label: 'National ID Card' },
];

/** Most ID files the user can attach */
export const MAX_ID_DOCUMENTS = 5;
