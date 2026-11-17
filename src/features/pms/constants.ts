/**
 * PMS home sample data: the text and figures of the
 * "UrbanNest Real Estate Dashboard" design.
 */

import { colors } from '@/config/theme';
import { pmsAssets } from './assets/pmsAssets';
import type {
  ActivityItem,
  FinancialFigure,
  LeasingStat,
  ManagedProperty,
  PmsPeriod,
  PmsProfile,
  PropertyTypeShare,
  Transaction,
} from './types';

export const PMS_PROFILE: PmsProfile = {
  initials: 'TU',
  role: 'Editorial Admin',
};

export const PERIODS: readonly { key: PmsPeriod; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'custom', label: 'Custom' },
];

export const PMS_SCOPE = {
  city: 'All Cities',
  properties: 'All Properties',
};

export const UNITS_SUMMARY = {
  total: 24,
  status: 'Active',
  properties: 6,
};

export const OCCUPANCY_SUMMARY = {
  rate: 87.5,
  trend: 2.3,
};

export const REVENUE_SUMMARY = {
  amount: '$18,420',
  collected: 94,
};

export const MAINTENANCE_SUMMARY = {
  overdue: 7,
  inProgress: 5,
};

export const LEASING_STATS: readonly LeasingStat[] = [
  { id: 'leads', label: 'Leads', value: 12, icon: 'userPlus' },
  { id: 'apps', label: 'Apps', value: 4, icon: 'userCheck' },
  { id: 'expiring', label: 'Expiring', value: 3, icon: 'calendarX', alert: true },
  { id: 'avgDays', label: 'Avg Days', value: 18, icon: 'calendar' },
];

/** Lease Cycle Efficiency: days now vs. the target cycle the bar is measured against */
export const LEASE_CYCLE = { days: 18, target: 30 };

export const PROPERTY_TYPES: readonly PropertyTypeShare[] = [
  // Four distinct app colours, each a deep → light gradient (colors.pmsSnapshot)
  { id: 'residential', label: 'Residential', count: 14, gradient: colors.pmsSnapshot[0] },
  { id: 'commercial', label: 'Commercial', count: 5, gradient: colors.pmsSnapshot[1] },
  { id: 'student', label: 'Student Housing', count: 3, gradient: colors.pmsSnapshot[2] },
  { id: 'shortTerm', label: 'Short-term', count: 2, gradient: colors.pmsSnapshot[3] },
];

export const FINANCIAL_FIGURES: readonly FinancialFigure[] = [
  { id: 'revenue', label: 'Revenue MTD', amount: '$18,420', tone: 'income', icon: 'trendingUp' },
  { id: 'expenses', label: 'Expenses MTD', amount: '($5,840)', tone: 'expense', icon: 'trendingDown' },
  { id: 'net', label: 'Net Income (MTD)', amount: '$12,580', tone: 'net', icon: 'check' },
  { id: 'pending', label: 'Pending Rent', amount: '$1,200', tone: 'pending', icon: 'clock' },
];

export const COLLECTION_RATE = 94;

/** Net income over the last 6 months (Financial Pulse trend line, design) */
export const NET_INCOME_TREND: readonly number[] = [9800, 11200, 10400, 11800, 11500, 12580];

export const MANAGED_PROPERTIES: readonly ManagedProperty[] = [
  {
    id: 'maple',
    name: '12 Maple Street',
    location: 'Austin, TX 78701',
    price: '$1,450',
    priceSuffix: '/mo',
    units: 4,
    occupancy: 100,
    status: 'For Rent',
    image: pmsAssets.mapleStreet,
  },
  {
    id: 'oak',
    name: '88 Oak Ave',
    location: 'Austin, TX',
    price: '$425.00',
    priceSuffix: '',
    units: 6,
    occupancy: 83,
    status: 'For Rent',
    image: pmsAssets.oakAve,
  },
  {
    id: 'pine',
    name: '34 Pine Rd',
    location: 'Austin, TX 78704',
    price: '$2,100',
    priceSuffix: '/mo',
    units: 5,
    occupancy: 80,
    status: 'For Rent',
    image: pmsAssets.pineRd,
  },
  {
    id: 'elm',
    name: '7 Elm St',
    location: 'Austin, TX 78702',
    price: '$1,200',
    priceSuffix: '/mo',
    units: 3,
    occupancy: 67,
    status: 'For Rent',
    image: pmsAssets.elmSt,
  },
  {
    id: 'cedar',
    name: '22 Cedar Ln',
    location: 'Austin, TX 78745',
    price: '$1,650',
    priceSuffix: '/mo',
    units: 4,
    occupancy: 100,
    status: 'For Rent',
    image: pmsAssets.cedarLn,
  },
  {
    id: 'birch',
    name: '15 Birch Blvd',
    location: 'Austin, TX 78758',
    price: '$1,380',
    priceSuffix: '/mo',
    units: 2,
    occupancy: 100,
    status: 'For Rent',
    image: pmsAssets.birchBlvd,
  },
];

export const RECENT_ACTIVITY: readonly ActivityItem[] = [
  {
    id: 'a1',
    title: 'New tenant signed lease',
    place: '12 Maple St, Unit 4B',
    time: '2h ago',
    icon: 'userPlus',
    color: colors.success,
  },
  {
    id: 'a2',
    title: 'Maintenance request submitted',
    place: '88 Oak Ave, Unit 2A',
    time: '4h ago',
    icon: 'wrench',
    color: colors.warning,
  },
  {
    id: 'a3',
    title: 'Rent payment received',
    place: '34 Pine Rd, Unit 1C',
    time: '5h ago',
    icon: 'creditCard',
    color: colors.primary,
  },
  {
    id: 'a4',
    title: 'Lease expiring in 30 days',
    place: '7 Elm St, Unit 3D',
    time: '1d ago',
    icon: 'alert',
    color: colors.error,
  },
  {
    id: 'a5',
    title: 'New application submitted',
    place: '22 Cedar Ln, Unit 5A',
    time: '1d ago',
    icon: 'fileText',
    color: colors.secondary,
  },
];

export const RECENT_TRANSACTIONS: readonly Transaction[] = [
  { id: 't1', property: '12 Maple St', type: 'Rent Received', amount: '+$1,450', tone: 'in' },
  { id: 't2', property: '88 Oak Ave', type: 'Vendor Invoice', amount: '-$320', tone: 'out' },
  { id: 't3', property: '34 Pine Rd', type: 'Rent Received', amount: '+$2,100', tone: 'in' },
  { id: 't4', property: '7 Elm St', type: 'Rent Overdue', amount: '$1,200', tone: 'overdue' },
  { id: 't5', property: '22 Cedar Ln', type: 'Management Fee', amount: '+$184', tone: 'in' },
  { id: 't6', property: '15 Birch Blvd', type: 'Maintenance Cost', amount: '-$540', tone: 'out' },
];
