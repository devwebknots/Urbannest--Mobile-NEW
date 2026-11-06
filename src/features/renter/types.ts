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
  readonly street: string;
  readonly city: string;
  readonly status: LeaseStatus;
  readonly premium?: boolean;
  /** Footer facts, e.g. renewal date, tenure */
  readonly meta: readonly ResidenceMeta[];
  readonly image: ImageSourcePropType;
}

export type RenterTab = 'residences' | 'search' | 'alerts' | 'profile';
