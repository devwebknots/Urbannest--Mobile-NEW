/**
 * Renter home data (mock until the leases API is wired).
 */

import { renterAssets } from './assets/renterAssets';
import type {
  CheckInSummary,
  CheckInTask,
  CommunityEvent,
  ConciergeService,
  FinancialSummary,
  InspectionArea,
  IssueCategory,
  LeaseStatus,
  NeighborhoodCategory,
  Residence,
  ResidenceFilter,
  ServiceRequest,
  UtilityService,
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
  active: 'Manage',
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
  { id: 'maintenance', label: 'Maintenance', icon: 'wrench', hint: 'Report an issue', accent: 'amber' },
  { id: 'invoices', label: 'Invoices', icon: 'invoice', hint: 'Bills & receipts', accent: 'blue' },
  { id: 'amenities', label: 'Amenities', icon: 'amenities', hint: 'Book facilities', accent: 'green' },
  { id: 'documents', label: 'Documents', icon: 'folder', hint: 'Your files', accent: 'violet' },
  { id: 'lease', label: 'Lease', icon: 'lease', hint: 'Renew & terms', accent: 'navy' },
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

/* ---------- Check-in (mock) ---------- */

export const CHECK_IN_SUMMARY: CheckInSummary = {
  leaseId: 'ABC123456',
  moveInDate: 'Nov 15, 2026',
  keyWindow: 'Keys from 9:00 AM',
  description:
    'Your curated residence is prepared for occupancy. All technical systems have been verified by our team.',
};

export const CHECK_IN_TASKS: readonly CheckInTask[] = [
  { id: 'inspection', label: 'Inspection', hint: 'Walkthrough report', icon: 'inspect', accent: 'blue', screen: 'InspectionArea' },
  { id: 'utilities', label: 'Utilities', hint: 'Power & water live', icon: 'bolt', accent: 'amber', screen: 'Utilities' },
  { id: 'internet', label: 'Internet', hint: 'Fibre activated', icon: 'wifi', accent: 'violet' },
  { id: 'security', label: 'Home Security', hint: 'Alarm & access', icon: 'shield', accent: 'green' },
];

/* ---------- Move-in inspection (mock) ---------- */

export const INSPECTION_AREAS: readonly InspectionArea[] = [
  { id: 'living', label: 'Living Room', hint: 'Walls, floors & windows', image: renterAssets.areaLiving },
  { id: 'dining', label: 'Dining', hint: 'Lighting & fixtures', image: renterAssets.areaDining },
  { id: 'kitchen', label: 'Kitchen', hint: 'Appliances & plumbing', image: renterAssets.areaKitchen },
  { id: 'bedrooms', label: 'Bedrooms', hint: 'Closets & fittings', image: renterAssets.areaBedroom },
  { id: 'washrooms', label: 'Washrooms', hint: 'Water flow & drainage', image: renterAssets.areaWashroom },
  { id: 'common', label: 'Common Areas', hint: 'Corridors & lobby', image: renterAssets.areaCommon },
  { id: 'outside', label: 'Outside Areas', hint: 'Terrace & landscaping', image: renterAssets.areaOutside },
];

/** Issue categories for the area page dropdown (later from the backend) */
export const ISSUE_CATEGORIES: readonly IssueCategory[] = [
  { id: 'walls', label: 'Walls & Paint' },
  { id: 'flooring', label: 'Flooring & Surfaces' },
  { id: 'doors', label: 'Doors & Windows' },
  { id: 'electrical', label: 'Electrical & Lighting' },
  { id: 'plumbing', label: 'Plumbing & Leaks' },
  { id: 'appliances', label: 'Appliances' },
  { id: 'fixtures', label: 'Furniture & Fixtures' },
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'pests', label: 'Pests' },
  { id: 'other', label: 'Other' },
];

/** Most photos / videos one issue can have */
export const MAX_ISSUE_MEDIA = 5;

/* ---------- Move-in utilities (mock) ---------- */

/**
 * Utilities and their providers for the residence. Provider names, phone
 * numbers (555) and websites (example.com) are placeholders until the
 * backend sends the real ones for each home.
 */
export const UTILITIES: readonly UtilityService[] = [
  {
    id: 'electricity',
    label: 'Electricity',
    hint: 'Power for lights, heating & appliances',
    description: 'Choose the energy partner on your lease to start service before move-in day.',
    icon: 'bolt',
    image: renterAssets.utilityElectricity,
    providers: [
      {
        id: 'gateway-power',
        name: 'Gateway Power & Light',
        kind: 'Investor-owned utility',
        description: 'Main grid supplier for the building, with smart billing and usage alerts.',
        tags: ['Grid supplier', 'Smart billing'],
        accent: 'blue',
        image: renterAssets.providerGatewayPower,
        phone: '(314) 555-0142',
        emergency: '(314) 555-0199',
        website: 'https://gatewaypower.example.com',
        hours: 'Mon – Fri · 7 am – 7 pm',
      },
      {
        id: 'prairie-wind',
        name: 'Prairie Wind Energy',
        kind: 'Renewable energy plan',
        description: 'Optional 100% wind-powered plan, billed through your grid supplier.',
        tags: ['100% renewable', 'Optional'],
        accent: 'violet',
        image: renterAssets.providerPrairieWind,
        phone: '(636) 555-0118',
        website: 'https://prairiewind.example.com',
        hours: 'Mon – Sat · 8 am – 6 pm',
      },
    ],
  },
  {
    id: 'water',
    label: 'Water Supply',
    hint: 'Drinking water & household supply',
    description: 'Water is billed by the city. Open an account in your name before you move in.',
    icon: 'faucet',
    image: renterAssets.utilityWater,
    providers: [
      {
        id: 'city-water',
        name: 'City Water Services',
        kind: 'Municipal utility',
        description: 'Supplies treated water to the building and reads your unit meter monthly.',
        tags: ['City utility', 'Monthly billing'],
        accent: 'blue',
        image: renterAssets.providerCityWater,
        phone: '(636) 555-0164',
        emergency: '(636) 555-0170',
        website: 'https://citywater.example.com',
        hours: 'Mon – Fri · 8 am – 5 pm',
      },
    ],
  },
  {
    id: 'gas',
    label: 'Gas Connection',
    hint: 'Cooking, heating & hot water',
    description: 'Natural gas runs the stove and water heater. Book a meter reading for move-in day.',
    icon: 'flame',
    image: renterAssets.utilityGas,
    providers: [
      {
        id: 'heartland-gas',
        name: 'Heartland Natural Gas',
        kind: 'Regulated gas utility',
        description: 'Gas supply and meter service for the building. Smell gas? Call the 24/7 line.',
        tags: ['Natural gas', 'Meter service'],
        accent: 'amber',
        image: renterAssets.providerHeartlandGas,
        phone: '(314) 555-0127',
        emergency: '(314) 555-0111',
        website: 'https://heartlandgas.example.com',
        hours: 'Mon – Fri · 7 am – 8 pm',
      },
    ],
  },
  {
    id: 'sewer',
    label: 'Sewer',
    hint: 'Wastewater & drainage',
    description: 'Sewer service is linked to your water account and billed with it.',
    icon: 'waves',
    image: renterAssets.utilitySewer,
    providers: [
      {
        id: 'lakeside-sanitary',
        name: 'Lakeside Sanitary District',
        kind: 'Public sewer district',
        description: 'Wastewater collection and treatment. Report backups or blocked drains any time.',
        tags: ['Public district', 'Billed with water'],
        accent: 'navy',
        image: renterAssets.providerLakesideSanitary,
        phone: '(636) 555-0135',
        emergency: '(636) 555-0188',
        website: 'https://lakesidesanitary.example.com',
        hours: 'Mon – Fri · 8 am – 4:30 pm',
      },
    ],
  },
];

export const NEIGHBORHOOD_RADIUS = '5 km';

export const NEIGHBORHOOD: readonly NeighborhoodCategory[] = [
  {
    id: 'schools',
    title: 'Nearby Schools',
    icon: 'school',
    accent: 'blue',
    places: [
      { name: 'Miracle International School', meta: 'Elite Preparatory', distance: '0.8 km', image: renterAssets.placeSchoolCampus },
      { name: 'Maple Grove Elementary', meta: 'Public Excellence', distance: '1.2 km', image: renterAssets.placeSchoolClassroom },
    ],
  },
  {
    id: 'hospitals',
    title: 'Hospitals',
    icon: 'hospital',
    accent: 'green',
    places: [
      { name: 'Cedarwood Memorial Hospital', meta: '24/7 Emergency', distance: '1.5 km', image: renterAssets.placeHospitalBuilding },
      { name: 'Evergreen Health Institute', meta: 'Specialized Care', distance: '2.1 km', image: renterAssets.placeHospitalLobby },
    ],
  },
  {
    id: 'parks',
    title: 'Amusement Parks',
    icon: 'park',
    accent: 'amber',
    places: [
      { name: 'StormRider Theme Park', meta: 'Entertainment Hub', distance: '3.4 km', image: renterAssets.placeParkCoaster },
      { name: 'Everland Adventure Park', meta: 'Family Recreation', distance: '4.2 km', image: renterAssets.placeParkSwing },
    ],
  },
];

export const CURATED_LIVING = {
  eyebrow: 'The Digital Curator Standard',
  title: 'Curated Living Experience',
  body: 'offers more than just a residence. It is an intersection of architectural precision and community proximity, designed for the discerning tenant.',
  image: renterAssets.livingCurated,
};
