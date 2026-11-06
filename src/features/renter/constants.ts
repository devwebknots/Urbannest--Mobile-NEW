/**
 * Renter home data (mock until the leases API is wired).
 */

import { renterAssets } from './assets/renterAssets';
import type {
  CommunityEvent,
  ConciergeService,
  FinancialSummary,
  LeaseStatus,
  Residence,
  ResidenceFilter,
  ServiceRequest,
} from './types';

export const RENTER_PROFILE = {
  firstName: 'Alex',
  initials: 'AM',
  unreadAlerts: 2,
};

export const RESIDENCES: readonly Residence[] = [
  {
    id: 'obsidian',
    name: 'The Obsidian Heights',
    unit: 'Suite 402',
    rent: '$3,200',
    street: '1489 Springborough Ct, Suite 402',
    city: "O'Fallon, MO",
    status: 'moveInReady',
    meta: [{ label: 'Renewal Date', value: 'Oct 12, 2024', icon: 'calendar' }],
    image: renterAssets.obsidian,
  },
  {
    id: 'sterling',
    name: 'The Sterling Collection',
    unit: 'Unit 1805',
    rent: '$5,400',
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
    unit: 'Main Residence',
    rent: '$6,100',
    street: '1122 Desert Ridge Rd',
    city: 'Scottsdale, AZ',
    status: 'active',
    meta: [{ label: 'Renewal Date', value: 'May 15, 2025', icon: 'calendar' }],
    image: renterAssets.azure,
  },
  {
    id: 'marble',
    name: 'The Marble Pavilion',
    unit: 'P-12',
    rent: '$2,400',
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

/* ---------- Residence dashboard (mock) ---------- */

export const CONCIERGE_SERVICES: readonly ConciergeService[] = [
  { id: 'maintenance', label: 'Maintenance', icon: 'wrench', tone: 'blue' },
  { id: 'invoices', label: 'Invoices', icon: 'invoice', tone: 'sand' },
  { id: 'amenities', label: 'Amenities', icon: 'amenities', tone: 'blue' },
  { id: 'documents', label: 'Documents', icon: 'folder', tone: 'sand' },
  { id: 'lease', label: 'Lease Management', icon: 'lease', tone: 'blue' },
];

export const FINANCIAL_SUMMARY: FinancialSummary = {
  rentDue: '$3,200.00',
  dueIn: 'Due in 3 Days',
  hoaFee: '$150.00',
  hoaScheduled: 'Scheduled: Oct 15',
};

export const RECENT_REQUESTS: readonly ServiceRequest[] = [
  {
    id: 'URB-4921',
    category: 'Plumbing',
    title: 'Leak in kitchen',
    ticket: 'Ticket #URB-4921',
    opened: 'Opened 2 hours ago',
    status: 'In Progress',
  },
];

export const FEATURED_EVENT: CommunityEvent = {
  id: 'sky-lounge-wine',
  title: 'Sky Lounge Wine Tasting',
  description:
    'Join us for an exclusive evening of vintage Bordeaux selections curated by Sommelier Elena Rossi. Limited capacity for 40 guests.',
  month: 'OCT',
  day: '12',
  attendees: ['JM', 'RK', 'SL'],
  moreCount: 12,
  attendingLabel: 'Alex + 15 others attending',
  image: renterAssets.eventSkyLounge,
};
