/**
 * Renter home data (mock until the leases API is wired).
 */

import type { ImageSourcePropType } from 'react-native';
import { renterAssets } from './assets/renterAssets';
import type {
  TicketChat,
  TicketNotification,
  BuzzEvent,
  CheckInSummary,
  CheckInTask,
  CommunityEvent,
  ConciergeService,
  FinancialSummary,
  HelpDeskTicket,
  InspectionArea,
  IssueCategory,
  LeaseStatus,
  ManageAction,
  MaintenanceBanner,
  MaintenanceCategory,
  MaintenanceNews,
  MaintenanceTicket,
  MaintenanceTicketDetails,
  ManageQuickAction,
  NeighborhoodCategory,
  ResolvedTicket,
  QuickAlert,
  Residence,
  ResidenceFilter,
  ServiceRequest,
  UtilityService,
} from './types';

export const RENTER_PROFILE = {
  firstName: 'John',
  fullName: 'John Doe',
  initials: 'JD',
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
      {
        id: 'sunfield-solar',
        name: 'Sunfield Solar Co-op',
        kind: 'Community solar',
        description: 'Subscribe to a share of a local solar farm and get credits on your power bill.',
        tags: ['Community solar', 'Bill credits'],
        accent: 'amber',
        image: renterAssets.providerSunfieldSolar,
        phone: '(636) 555-0153',
        website: 'https://sunfieldsolar.example.com',
        hours: 'Mon – Fri · 9 am – 5 pm',
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
      {
        id: 'riverbend-water',
        name: 'Riverbend Water District',
        kind: 'Regional water district',
        description: 'Backup supplier for the area. Runs water quality reports and boil-water notices.',
        tags: ['Regional', 'Water quality'],
        accent: 'violet',
        image: renterAssets.providerRiverbendWater,
        phone: '(636) 555-0176',
        emergency: '(636) 555-0182',
        website: 'https://riverbendwater.example.com',
        hours: 'Mon – Fri · 7:30 am – 4:30 pm',
      },
      {
        id: 'aquapure',
        name: 'AquaPure Home Services',
        kind: 'Water heater & softener service',
        description: 'Services the water heater and softener in your unit. Book a check before move-in.',
        tags: ['In-unit service', 'Bookings'],
        accent: 'navy',
        image: renterAssets.providerAquaPure,
        phone: '(314) 555-0108',
        website: 'https://aquapure.example.com',
        hours: 'Mon – Sat · 8 am – 6 pm',
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
      {
        id: 'midwest-energy',
        name: 'Midwest Energy Choice',
        kind: 'Gas supply plan',
        description: 'Optional fixed-rate gas plan. Delivery and meter service stay with your gas utility.',
        tags: ['Fixed rate', 'Optional'],
        accent: 'blue',
        image: renterAssets.providerMidwestEnergy,
        phone: '(314) 555-0161',
        website: 'https://midwestenergychoice.example.com',
        hours: 'Mon – Fri · 8 am – 6 pm',
      },
      {
        id: 'gas-safety',
        name: 'Gateway Gas Safety',
        kind: 'Appliance & safety checks',
        description: 'Connects your stove and checks gas appliances for leaks on move-in day.',
        tags: ['Safety check', 'Move-in visit'],
        accent: 'violet',
        image: renterAssets.providerGasSafety,
        phone: '(636) 555-0147',
        emergency: '(636) 555-0149',
        website: 'https://gatewaygassafety.example.com',
        hours: 'Mon – Sat · 7 am – 7 pm',
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
      {
        id: 'county-wastewater',
        name: 'County Wastewater Authority',
        kind: 'Wastewater treatment',
        description: 'Treats the district’s wastewater and handles main-line repairs on the street.',
        tags: ['Treatment', 'Main lines'],
        accent: 'blue',
        image: renterAssets.providerCountyWastewater,
        phone: '(636) 555-0193',
        emergency: '(636) 555-0195',
        website: 'https://countywastewater.example.com',
        hours: 'Mon – Fri · 8 am – 5 pm',
      },
      {
        id: 'metro-drain',
        name: 'Metro Drain & Sewer Co.',
        kind: 'Drain & sewer repair',
        description: 'Clears blocked drains and sewer backups inside the building, day or night.',
        tags: ['Drain cleaning', '24/7 callouts'],
        accent: 'amber',
        image: renterAssets.providerMetroDrain,
        phone: '(314) 555-0139',
        emergency: '(314) 555-0140',
        website: 'https://metrodrain.example.com',
        hours: 'Every day · 24 hours',
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

/* ---------- Manage (my home, mock) ---------- */

export const MANAGE_ACTIONS: readonly ManageAction[] = [
  { id: 'maintenance', label: 'Maintenance', icon: 'lineWrench', accent: 'amber' },
  { id: 'scheduling', label: 'Scheduling', icon: 'lineCalendar', accent: 'blue' },
  { id: 'amenities', label: 'Amenities', icon: 'lineDumbbell', accent: 'green' },
  { id: 'access', label: 'Access', icon: 'lineKey', accent: 'violet' },
];

/** Rent card on the Manage page (the amount comes from the residence) */
export const RENT_DUE = {
  dueDate: 'Nov 12, 2026',
  daysLeft: 3,
  /** Days in the billing cycle (drives the countdown ring) */
  cycleDays: 30,
};

/** Pastel tiles under "Quick Actions" on the Manage page */
export const MANAGE_QUICK_ACTIONS: readonly ManageQuickAction[] = [
  { id: 'rent', title: 'Rent Due', detail: 'in 3 days', icon: 'calendar', accent: 'amber', highlight: true },
  { id: 'maintenance', title: 'Maintenance', detail: 'Tomorrow', icon: 'wrench', accent: 'blue' },
  { id: 'hoa', title: 'HOA Fee', detail: 'Pending', icon: 'bell', accent: 'violet' },
  { id: 'more', title: 'More', detail: 'Actions', icon: 'grid', accent: 'green' },
];

/** "This Week" timeline on the Manage page, soonest first */
export const QUICK_ALERTS: readonly QuickAlert[] = [
  { id: 'pest', title: 'Pest Control', hint: 'Building-wide visit', month: 'NOV', day: '14', tag: 'Upcoming', accent: 'amber' },
  { id: 'hoa', title: 'HOA Fee', hint: 'Pending payment', month: 'NOV', day: '15', amount: '$200.00', accent: 'blue' },
  { id: 'check', title: 'Maintenance Check', hint: 'Annual unit check', month: 'NOV', day: '18', accent: 'green' },
];

export const COMMUNITY_BUZZ: readonly BuzzEvent[] = [
  {
    id: 'plant-day',
    title: 'Plant Day',
    host: 'By Management Team',
    date: 'Nov 22, 2026',
    time: '9:00 AM – 11:30 AM',
    audience: 'Public',
    registrationOpen: true,
    image: renterAssets.areaOutside,
  },
  {
    id: 'wine-tasting',
    title: 'Sky Lounge Wine Tasting',
    host: 'By Resident Club',
    date: 'Nov 28, 2026',
    time: '7:00 PM – 9:30 PM',
    audience: 'Residents',
    registrationOpen: true,
    image: renterAssets.eventSkyLounge,
  },
  {
    id: 'family-day',
    title: 'Family Fun Day',
    host: 'By Management Team',
    date: 'Dec 6, 2026',
    time: '10:00 AM – 4:00 PM',
    audience: 'Public',
    registrationOpen: false,
    image: renterAssets.placeParkSwing,
  },
  {
    id: 'lobby-social',
    title: 'Lobby Coffee Morning',
    host: 'By Concierge Desk',
    date: 'Dec 13, 2026',
    time: '8:30 AM – 10:00 AM',
    audience: 'Residents',
    registrationOpen: true,
    image: renterAssets.areaCommon,
  },
];

export const HELP_DESK_TICKETS: readonly HelpDeskTicket[] = [
  {
    id: 'URB-4921',
    category: 'Plumbing',
    title: 'Leak in plumbing unit in kitchen',
    date: 'Jan 28, 2025',
    status: 'Pending',
    image: renterAssets.providerAquaPure,
  },
  {
    id: 'URB-4917',
    category: 'Electrical',
    title: 'Short circuit in power unit',
    date: 'Jan 28, 2025',
    status: 'In Progress',
    image: renterAssets.providerGatewayPower,
  },
  {
    id: 'URB-4902',
    category: 'Masonry',
    title: 'Repair work in wall',
    date: 'Jan 26, 2025',
    status: 'Resolved',
    image: renterAssets.providerCountyWastewater,
  },
];

/* ---------- Maintenance (mock) ---------- */

/** Sliding banners at the top of the Maintenance page (artwork 16:9) */
export const MAINTENANCE_BANNERS: readonly MaintenanceBanner[] = [
  { id: 'scheduled', title: 'Scheduled Maintenance', image: renterAssets.bannerScheduled },
  { id: 'monsoon', title: 'Monsoon Maintenance Drive', image: renterAssets.bannerMonsoon },
  { id: 'repair', title: 'Repair & Upkeep Work in Progress', image: renterAssets.bannerRepair },
];

/** Width / height of the banner artwork */
export const MAINTENANCE_BANNER_ASPECT = 1280 / 720;

/** Category tiles on the maintenance request form */
export const MAINTENANCE_CATEGORIES: readonly MaintenanceCategory[] = [
  { id: 'plumbing', label: 'Plumbing', icon: 'faucet' },
  { id: 'electrical', label: 'Electrical', icon: 'bolt' },
  { id: 'hvac', label: 'HVAC', icon: 'airVent' },
  { id: 'general', label: 'General', icon: 'wrench' },
  { id: 'other', label: 'Other', icon: 'ellipsis' },
];

/** Longest detailed description on the request form */
export const MAINTENANCE_DESCRIPTION_MAX = 500;

/** Photo on the request form's "Need a Fix?" card */
export const MAINTENANCE_REQUEST_HERO = renterAssets.requestHero;

export const MAINTENANCE_TICKETS: readonly MaintenanceTicket[] = [
  {
    id: 'RE-4092',
    category: 'HVAC / Scheduled',
    title: 'HVAC Filter Replacement',
    description: 'Routine seasonal maintenance scheduled for Thursday morning between 9:00 AM and 11:00 AM.',
    icon: 'hvac',
    accent: 'blue',
    meta: [
      { icon: 'calendar', label: 'Oct 24' },
      { icon: 'user', label: 'James T.' },
    ],
  },
  {
    id: 'RE-5104',
    category: 'Plumbing / In Progress',
    title: 'Leaking Kitchen Faucet',
    description: 'Technician has ordered replacement parts from the manufacturer. Expected completion: Oct 26.',
    icon: 'plumbing',
    accent: 'amber',
    meta: [{ icon: 'clock', label: 'Pending Parts' }],
  },
];

/**
 * Older notification / chat history for a ticket (mock), shown after the
 * design's own items so the "View all" page has a long list to scroll.
 */
const OLDER_TICKET_NOTIFICATIONS: readonly (readonly [string, string])[] = [
  ['Oct 24, 2023 • 09:40 AM', 'Technician checked in at your unit'],
  ['Oct 24, 2023 • 08:15 AM', 'Technician is on the way'],
  ['Oct 23, 2023 • 06:30 PM', 'Replacement parts delivered'],
  ['Oct 23, 2023 • 02:10 PM', 'Replacement parts ordered'],
  ['Oct 23, 2023 • 11:00 AM', 'Visit confirmed for Oct 24, 9:00 AM'],
  ['Oct 22, 2023 • 07:45 PM', 'Inspection notes added to your request'],
  ['Oct 22, 2023 • 05:30 PM', 'Technician assigned to your request'],
  ['Oct 22, 2023 • 04:20 PM', 'Priority set to Medium'],
  ['Oct 22, 2023 • 04:16 PM', 'Photos received with your request'],
  ['Oct 22, 2023 • 04:15 PM', 'Maintenance request received'],
];

function olderTicketNotifications(): TicketNotification[] {
  return OLDER_TICKET_NOTIFICATIONS.map(([time, message], i) => ({
    id: `older-${i}`,
    title: 'System Generated',
    time,
    message,
  }));
}

function olderTicketChats(tech: {
  name: string;
  initials: string;
  photo?: ImageSourcePropType;
}): TicketChat[] {
  const you = { name: 'You', initials: RENTER_PROFILE.initials, fromMe: true };
  const desk = { name: 'Front Desk', initials: 'FD' };
  type Who = { name: string; initials: string; photo?: ImageSourcePropType; fromMe?: boolean };
  // Newest first: [sender, message, day, time]
  const rows: readonly (readonly [Who, string, string, string])[] = [
    [tech, 'Parts are in. See you tomorrow morning.', 'Oct 23', '06:45 PM'],
    [you, 'Great, thanks for the update!', 'Oct 23', '02:30 PM'],
    [tech, 'I have ordered the replacement O-ring.', 'Oct 23', '02:12 PM'],
    [tech, 'Please keep the area under the sink clear.', 'Oct 22', '06:05 PM'],
    [you, 'Is there anything I should do before you come?', 'Oct 22', '06:01 PM'],
    [desk, 'A technician will be assigned shortly.', 'Oct 22', '04:40 PM'],
    [you, 'Thank you. The leak is getting worse.', 'Oct 22', '04:32 PM'],
    [desk, 'We have received your request.', 'Oct 22', '04:20 PM'],
  ];
  return rows.map(([who, message, day, time], i) => ({
    id: `older-chat-${i}`,
    name: who.name,
    initials: who.initials,
    photo: who.photo,
    fromMe: who.fromMe,
    message,
    day,
    time,
  }));
}

/** Ticket Details page data, keyed by ticket ID (mock) */
export const MAINTENANCE_TICKET_DETAILS: Readonly<Record<string, MaintenanceTicketDetails>> = {
  'RE-5104': {
    status: 'In Progress',
    statusAccent: 'amber',
    description:
      'Water is pooling under the sink whenever the tap is running. Possible loose connection or gasket failure.',
    reported: 'Reported yesterday at 4:15 PM',
    assignee: {
      name: 'Marcus Richardson',
      initials: 'MR',
      photo: renterAssets.technicianMarcus,
    },
    timeline: [
      {
        id: 'received',
        title: 'Request Received',
        detail: 'Maintenance request successfully logged and queued.',
        time: 'Oct 24, 16:15',
        state: 'done',
      },
      {
        id: 'assigned',
        title: 'Technician Assigned',
        detail: 'Marcus Richardson has been assigned to your unit.',
        time: 'Oct 24, 17:30',
        state: 'done',
      },
      {
        id: 'repair',
        title: 'Repair in Progress',
        detail: 'Marcus is replacing a worn O-ring in the swivel spout.',
        time: 'Today, 09:12',
        state: 'current',
        photo: {
          image: renterAssets.ticketFaucetRepair,
          caption: 'Internal component inspection',
        },
      },
      {
        id: 'completion',
        title: 'Completion',
        detail: 'Awaiting final sign-off.',
        time: 'Pending',
        state: 'pending',
      },
    ],
    notifications: [
      {
        id: 'n1',
        title: 'System Generated',
        time: 'Oct 24, 2023 • 11:05 AM',
        message: 'Maintenance work completed\nReady for Verification',
      },
      ...olderTicketNotifications(),
    ],
    chats: [
      {
        id: 'c1',
        name: 'Marcus Richardson',
        initials: 'MR',
        photo: renterAssets.technicianMarcus,
        message: "I'll be there around 9 AM to replace the O-ring.",
        day: 'Today',
        time: '08:40 AM',
      },
      {
        id: 'c2',
        name: 'Front Desk',
        initials: 'FD',
        message: 'Your request has been passed to our plumbing team.',
        day: 'Oct 24',
        time: '05:30 PM',
      },
      ...olderTicketChats({
        name: 'Marcus Richardson',
        initials: 'MR',
        photo: renterAssets.technicianMarcus,
      }),
    ],
  },
  'RE-4092': {
    status: 'Scheduled',
    statusAccent: 'blue',
    description:
      'Seasonal replacement of the HVAC air filter and a quick check of the vents and thermostat.',
    reported: 'Reported Oct 20 at 10:05 AM',
    assignee: {
      name: 'James Turner',
      initials: 'JT',
      photo: renterAssets.technicianJames,
    },
    // Same steps as the design; only the technician's name differs
    timeline: [
      {
        id: 'received',
        title: 'Request Received',
        detail: 'Maintenance request successfully logged and queued.',
        time: 'Oct 24, 16:15',
        state: 'done',
      },
      {
        id: 'assigned',
        title: 'Technician Assigned',
        detail: 'James Turner has been assigned to your unit.',
        time: 'Oct 24, 17:30',
        state: 'done',
      },
      {
        id: 'repair',
        title: 'Repair in Progress',
        detail: 'James is replacing a worn O-ring in the swivel spout.',
        time: 'Today, 09:12',
        state: 'current',
        photo: {
          image: renterAssets.ticketFaucetRepair,
          caption: 'Internal component inspection',
        },
      },
      {
        id: 'completion',
        title: 'Completion',
        detail: 'Awaiting final sign-off.',
        time: 'Pending',
        state: 'pending',
      },
    ],
    notifications: [
      {
        id: 'n1',
        title: 'System Generated',
        time: 'Oct 24, 2023 • 11:05 AM',
        message: 'Maintenance work completed\nReady for Verification',
      },
      ...olderTicketNotifications(),
    ],
    chats: olderTicketChats({
      name: 'James Turner',
      initials: 'JT',
      photo: renterAssets.technicianJames,
    }),
  },
};

export const RESOLVED_TICKETS: readonly ResolvedTicket[] = [
  { id: 'RE-3981', title: 'Water leakage in hall', completed: 'Completed 2 days ago' },
  { id: 'RE-3940', title: 'Smart Lock Re-calibration', completed: 'Completed 4 days ago' },
  { id: 'RE-3902', title: 'Balcony Door Alignment', completed: 'Completed Oct 15' },
];

export const MAINTENANCE_NEWS: readonly MaintenanceNews[] = [
  {
    id: 'fiber',
    tag: 'Building Update',
    title: 'High-Speed Fiber Upgrade Commencing',
    body: 'We are enhancing our digital infrastructure with dedicated fiber to every unit, ensuring gigabit speeds for all residents.',
    image: renterAssets.header,
  },
  {
    id: 'scent',
    tag: 'Lifestyle',
    title: 'Signature Autumn Scent Series',
    body: 'Experience our curated seasonal fragrance profile "Midnight Cedar" now greeting you in all common areas and elevators.',
    image: renterAssets.livingCurated,
  },
  {
    id: 'water',
    tag: 'Notice',
    title: 'Water Shut-Off Tuesday Morning',
    body: 'Water will be off from 10:00 AM to 12:00 PM while the main valve on level three is serviced.',
    image: renterAssets.utilityWater,
  },
  {
    id: 'garden',
    tag: 'Community',
    title: 'Courtyard Garden Planting Day',
    body: 'Bring the family to plant the new winter beds with our landscaping team. Tools and refreshments provided.',
    image: renterAssets.areaOutside,
  },
];
