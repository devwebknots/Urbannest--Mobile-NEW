/**
 * Landlord dashboard sample data (text and figures from the
 * "UrbanNest Landlord Dashboard Overview" design). Swap for API data later.
 */

import { colors } from '@/config/theme';
import { landlordAssets } from './assets/landlordAssets';
import type {
  HubMessage,
  Insight,
  LandlordProfile,
  LandlordTone,
  MonthlyRent,
  OperationItem,
  PortfolioStat,
  PrimeAsset,
  QuickStat,
  RecentDocument,
  VendorPerformance,
} from './types';

export const LANDLORD_PROFILE: LandlordProfile = {
  name: 'Nan Webknots',
  initials: 'NW',
  role: 'Verified Property Owner',
  unreadAlerts: 1,
};

export const PORTFOLIO_STATS: readonly PortfolioStat[] = [
  { id: 'properties', label: 'Properties', value: 3, icon: 'building' },
  { id: 'units', label: 'Total Units', value: 28, icon: 'layers' },
  { id: 'tenants', label: 'Active Tenants', value: 24, icon: 'users' },
];

export const RENT_COLLECTION = {
  collected: 430000,
  expected: 500000,
  /** Change in collection rate vs. last quarter, in points */
  trend: 4.8,
  trendCaption: 'vs. last quarter',
} as const;

export const OCCUPANCY = { occupied: 25, total: 28 } as const;

export const QUICK_STATS: readonly QuickStat[] = [
  { id: 'leases', value: '4', label: 'Signed', caption: 'New leases', icon: 'fileText', tone: 'blue' },
  { id: 'rent', value: '₹4,30,000', caption: 'Rent collected', icon: 'database', tone: 'green' },
  { id: 'tickets', value: '3', label: 'Active', caption: 'Open tickets', icon: 'tag', tone: 'amber' },
  { id: 'overdue', value: '1', label: 'Overdue', caption: 'Payment', icon: 'alert', tone: 'red' },
];

/** Last 12 months, oldest first; the last entry is the current month */
export const MONTHLY_RENT: readonly MonthlyRent[] = [
  { month: 'Dec', amount: 260000 },
  { month: 'Jan', amount: 280000 },
  { month: 'Feb', amount: 270000 },
  { month: 'Mar', amount: 285000 },
  { month: 'Apr', amount: 300000 },
  { month: 'May', amount: 290000 },
  { month: 'Jun', amount: 235000 },
  { month: 'Jul', amount: 310000 },
  { month: 'Aug', amount: 320000 },
  { month: 'Sep', amount: 340000 },
  { month: 'Oct', amount: 405000 },
  { month: 'Nov', amount: 430000 },
];

/** Chart scale: ₹0 to ₹6.0L in 4 steps of ₹1.5L */
export const RENT_CHART_MAX = 600000;
export const RENT_CHART_STEPS = 4;

export const RENT_RANGE_LABELS = {
  3: 'Last 3 Months',
  6: 'Last 6 Months',
  12: 'Last 12 Months',
} as const;

export const PRIME_ASSETS: readonly PrimeAsset[] = [
  {
    id: 'regent-plaza',
    name: 'The Regent Plaza',
    status: 'Stabilized',
    location: 'Centreton, US',
    units: 12,
    occupied: 11,
    image: landlordAssets.regentPlaza,
  },
  {
    id: 'emerald-gardens',
    name: 'Emerald Gardens',
    status: 'Active',
    location: 'Westhill, US',
    units: 10,
    occupied: 8,
    image: landlordAssets.emeraldGardens,
  },
  {
    id: 'oakridge-residency',
    name: 'Oakridge Residency',
    status: 'Active',
    location: 'Overcup Oak Ln, US',
    units: 6,
    occupied: 6,
    image: landlordAssets.oakridge,
  },
];

export const OPEN_OPERATIONS: readonly OperationItem[] = [
  { id: 'maintenance', label: 'Maintenance tickets', count: 2, icon: 'tools' },
  { id: 'renewals', label: 'Lease renewals', count: 1, icon: 'fileClock' },
  { id: 'inspections', label: 'Inspection due', count: 0, icon: 'circleDot' },
];

export const VENDOR_PERFORMANCE: VendorPerformance = {
  score: 96,
  trend: 2,
  caption: 'Reliability score across completed requests',
  history: [0.18, 0.22, 0.2, 0.3, 0.34, 0.3, 0.42, 0.5, 0.46, 0.58, 0.55, 0.7, 0.66, 0.84, 1],
};

export const RECENT_DOCUMENTS: readonly RecentDocument[] = [
  { id: 'lease-402', title: 'Lease Agreement – #402', meta: 'Updated 2 days ago • 1.2MB' },
  { id: 'q3-report', title: 'Q3 Financial Report', meta: 'Aug 15, 2023 • 4.0MB' },
  { id: 'insurance', title: 'Insurance Certificate', meta: 'Expires in 4 months' },
];

export const HUB_MESSAGES: readonly HubMessage[] = [
  {
    id: 'estate-manager',
    sender: 'Estate Manager',
    message: '“The inspection for Emerald Gardens is finalized. Sending over the report now.”',
    time: '10 min ago',
    unread: true,
    icon: 'building',
  },
  {
    id: 'maintenance-team',
    sender: 'Maintenance Team',
    message: '“Vendor dispatched for The Regent Plaza pressure leak. ETA 35 mins.”',
    time: '1 hr ago',
    unread: true,
    icon: 'tools',
  },
];

export const INSIGHTS: readonly Insight[] = [
  {
    id: 'rent-trend',
    title: 'Rent Trend Analysis',
    body: 'Collections are up 6.2% this month, driven by full occupancy at Oakridge Residency.',
    icon: 'chart',
    tone: 'blue',
  },
  {
    id: 'maintenance-forecast',
    title: 'Maintenance Forecast',
    body: 'HVAC units at Emerald Gardens are nearing service due in 30 days.',
    icon: 'lightbulb',
    tone: 'amber',
  },
];

/** Icon tile / badge colours per tone (theme status colours) */
export const TONE_COLORS: Record<LandlordTone, { bg: string; fg: string }> = {
  blue: { bg: colors.chipBlue, fg: colors.primary },
  green: { bg: colors.successLight, fg: colors.successDark },
  amber: { bg: colors.warningLight, fg: colors.warningDark },
  red: { bg: colors.errorLight, fg: colors.error },
};
