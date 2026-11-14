/**
 * Landlord feature types (dashboard model).
 */

import type { landlordIcons } from './assets/landlordAssets';

export type LandlordIconName = keyof typeof landlordIcons;

/** Colour family of a small icon tile / badge */
export type LandlordTone = 'blue' | 'green' | 'amber' | 'red';

export interface LandlordProfile {
  readonly name: string;
  readonly initials: string;
  readonly role: string;
  readonly unreadAlerts: number;
}

export interface PortfolioStat {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly icon: LandlordIconName;
}

export interface QuickStat {
  readonly id: string;
  /** Big first line ("4", "₹4,30,000") */
  readonly value: string;
  /** Bold second line ("Signed"); omitted when the value says it all */
  readonly label?: string;
  readonly caption: string;
  readonly icon: LandlordIconName;
  readonly tone: LandlordTone;
}

export interface MonthlyRent {
  /** "Nov" */
  readonly month: string;
  /** Collected rent in rupees */
  readonly amount: number;
}

export type RentRange = 3 | 6 | 12;

export type AssetStatus = 'Stabilized' | 'Active';

export interface PrimeAsset {
  readonly id: string;
  readonly name: string;
  readonly status: AssetStatus;
  readonly location: string;
  readonly units: number;
  readonly occupied: number;
  readonly image: number;
}

export interface OperationItem {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly icon: LandlordIconName;
}

export interface VendorPerformance {
  /** 0 - 100 */
  readonly score: number;
  /** Change in points vs. last period */
  readonly trend: number;
  readonly caption: string;
  /** Sparkline points, 0 - 1 */
  readonly history: readonly number[];
}

export interface RecentDocument {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
}

export interface HubMessage {
  readonly id: string;
  readonly sender: string;
  readonly message: string;
  readonly time: string;
  readonly unread: boolean;
  readonly icon: LandlordIconName;
}

export interface Insight {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly icon: LandlordIconName;
  readonly tone: 'blue' | 'amber';
}

export type LandlordTab = 'dashboard' | 'properties' | 'leases' | 'more';
