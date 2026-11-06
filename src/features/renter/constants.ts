/**
 * Renter home data (mock until the leases API is wired).
 */

import { renterAssets } from './assets/renterAssets';
import type { LeaseStatus, Residence, ResidenceFilter } from './types';

export const RENTER_PROFILE = {
  firstName: 'Alex',
  initials: 'AM',
  unreadAlerts: 2,
};

export const RESIDENCES: readonly Residence[] = [
  {
    id: 'obsidian',
    name: 'The Obsidian Heights',
    street: '1489 Springborough Ct, Suite 402',
    city: "O'Fallon, MO",
    status: 'moveInReady',
    meta: [{ label: 'Renewal Date', value: 'Oct 12, 2024', icon: 'calendar' }],
    image: renterAssets.obsidian,
  },
  {
    id: 'sterling',
    name: 'The Sterling Collection',
    street: '722 Platinum Way, Unit 1805',
    city: 'Miami, FL',
    status: 'active',
    premium: true,
    meta: [{ label: 'Renewal Date', value: 'Jan 24, 2025', icon: 'calendar' }],
    image: renterAssets.sterling,
  },
  {
    id: 'azure',
    name: 'Azure Estate',
    street: '1122 Desert Ridge Rd',
    city: 'Scottsdale, AZ',
    status: 'active',
    meta: [{ label: 'Renewal Date', value: 'May 15, 2025', icon: 'calendar' }],
    image: renterAssets.azure,
  },
  {
    id: 'marble',
    name: 'The Marble Pavilion',
    street: 'P-12, Heritage Square',
    city: 'Charleston, SC',
    status: 'expired',
    meta: [
      { label: 'Lease Ended', value: 'March 2023', icon: 'calendar' },
      { label: 'Tenure', value: '2 Years', icon: 'clock' },
    ],
    image: renterAssets.marble,
  },
];

export const STATUS_LABEL: Record<LeaseStatus, string> = {
  moveInReady: 'Move-In Ready',
  active: 'Active Lease',
  expired: 'Lease Expired',
};

export const ACTION_LABEL: Record<LeaseStatus, string> = {
  moveInReady: 'Check-In Now',
  active: 'Manage Residence',
  expired: 'Details',
};

export const FILTERS: readonly { key: ResidenceFilter; label: string }[] = [
  { key: 'all', label: 'All Rentals' },
  { key: 'current', label: 'Active' },
  { key: 'past', label: 'Past' },
];

/** Photo height = card width * ratio. Same for every card so the list stays uniform. */
export const RESIDENCE_IMAGE_RATIO = 0.46;
