/**
 * Renter feature types.
 */

import type { ImageSourcePropType } from 'react-native';

export type LeaseStatus = 'moveInReady' | 'active' | 'expired';

export type ResidenceFilter = 'all' | 'current' | 'past';

export interface ResidenceMeta {
  readonly label: string;
  readonly value: string;
  readonly icon: 'calendar' | 'clock';
}

export interface Residence {
  readonly id: string;
  readonly name: string;
  /** Suite / unit line, e.g. "Suite 402" */
  readonly unit: string;
  /** Monthly rent, e.g. "$3,200" */
  readonly rent: string;
  readonly street: string;
  readonly city: string;
  readonly status: LeaseStatus;
  readonly premium?: boolean;
  /** Footer facts, e.g. renewal date, tenure */
  readonly meta: readonly ResidenceMeta[];
  readonly image: ImageSourcePropType;
}

export type RenterTab = 'residences' | 'search' | 'alerts' | 'profile';

/* ---------- Residence dashboard ---------- */

export type ConciergeIcon = 'wrench' | 'invoice' | 'amenities' | 'folder' | 'lease';

export interface ConciergeService {
  readonly id: string;
  readonly label: string;
  readonly icon: ConciergeIcon;
  /** Tile tint: cool blue or warm sand (alternates like the design) */
  readonly tone: 'blue' | 'sand';
}

export interface FinancialSummary {
  readonly rentDue: string;
  readonly dueIn: string;
  readonly hoaFee: string;
  readonly hoaScheduled: string;
}

export interface ServiceRequest {
  readonly id: string;
  readonly category: string;
  readonly title: string;
  readonly ticket: string;
  readonly opened: string;
  readonly status: 'In Progress' | 'Scheduled' | 'Resolved';
}

export interface CommunityEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly month: string;
  readonly day: string;
  /** Initials of a few attendees shown as avatars */
  readonly attendees: readonly string[];
  readonly moreCount: number;
  readonly attendingLabel: string;
  readonly image: ImageSourcePropType;
}
