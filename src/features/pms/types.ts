/**
 * PMS (property manager) home types.
 */

import type { ImageSourcePropType } from 'react-native';
import type { PmsIconName } from './assets/pmsAssets';

export type { PmsIconName };

export type PmsPeriod = 'today' | 'week' | 'month' | 'custom';

export type PmsTab = 'dashboard' | 'properties' | 'financials' | 'approvals' | 'profile';

export interface PmsProfile {
  readonly initials: string;
  /** Small line under the brand ("EDITORIAL ADMIN") */
  readonly role: string;
}

/** The KPI tile colours (theme colors.pmsTiles keys) */
export type PmsTileTone = 'units' | 'occupancy' | 'revenue' | 'maintenance';

export interface LeasingStat {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly icon: PmsIconName;
  /** Red tile (Expiring) */
  readonly alert?: boolean;
}

export interface PropertyTypeShare {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  /** Deep → light gradient: bars, legend swatch, donut slice */
  readonly gradient: readonly [string, string];
}

export type MoneyTone = 'income' | 'expense' | 'net' | 'pending';

export interface FinancialFigure {
  readonly id: string;
  readonly label: string;
  /** Already formatted, e.g. "$18,420", "($5,840)" */
  readonly amount: string;
  readonly tone: MoneyTone;
  readonly icon: PmsIconName;
}

export interface ManagedProperty {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  /** Already formatted, e.g. "$1,450" */
  readonly price: string;
  /** e.g. "/mo"; empty for a sale price */
  readonly priceSuffix: string;
  readonly units: number;
  /** 0 – 100 */
  readonly occupancy: number;
  readonly status: string;
  readonly image: ImageSourcePropType;
}

export interface ActivityItem {
  readonly id: string;
  readonly title: string;
  readonly place: string;
  readonly time: string;
  readonly icon: PmsIconName;
  readonly color: string;
}

export type TransactionTone = 'in' | 'out' | 'overdue';

export interface Transaction {
  readonly id: string;
  readonly property: string;
  readonly type: string;
  /** Already formatted with sign, e.g. "+$1,450" */
  readonly amount: string;
  readonly tone: TransactionTone;
}
