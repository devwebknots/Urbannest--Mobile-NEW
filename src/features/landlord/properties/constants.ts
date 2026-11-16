/**
 * Add New Property ("Property Basic Information") options.
 */

import type { AmenityIconName } from '../assets/landlordAssets';

export const PROPERTY_TYPES: readonly { id: string; label: string }[] = [
  { id: 'apartment', label: 'Apartment Building' },
  { id: 'singleFamily', label: 'Single-Family Home' },
  { id: 'multiFamily', label: 'Multi-Family Home' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'condo', label: 'Condominium' },
  { id: 'villa', label: 'Villa' },
  { id: 'commercial', label: 'Commercial' },
];

export const OWNERSHIP_TYPES: readonly { id: string; label: string }[] = [
  { id: 'individual', label: 'Individual' },
  { id: 'joint', label: 'Joint Ownership' },
  { id: 'llc', label: 'LLC / Company' },
  { id: 'trust', label: 'Trust' },
  { id: 'partnership', label: 'Partnership' },
];

export interface PropertyAmenity {
  readonly id: string;
  readonly label: string;
  readonly icon: AmenityIconName;
  /**
   * Shared facility units / tenants can be given access to ("Amenities
   * Access"); the name used in "Provide access to the … for units/tenants."
   * Absent: a feature of the building (AC, CCTV…), nothing to grant.
   */
  readonly accessName?: string;
}

/** Amenities tab: the design's 8 tiles (in its order), then the access list */
export const PROPERTY_AMENITIES: readonly PropertyAmenity[] = [
  { id: 'ac', label: 'Air Conditioner', icon: 'airVent' },
  { id: 'balcony', label: 'Balcony', icon: 'balcony' },
  { id: 'cctv', label: 'CCTV', icon: 'cctv' },
  { id: 'gym', label: 'Gym', icon: 'dumbbell', accessName: 'gym' },
  { id: 'communityHall', label: 'Community Hall', icon: 'users', accessName: 'community hall' },
  { id: 'elevator', label: 'Elevator / Lift', icon: 'elevator', accessName: 'elevator' },
  { id: 'garden', label: 'Garden / Lawn', icon: 'sprout', accessName: 'garden/lawn' },
  { id: 'laundry', label: 'Laundry Room', icon: 'washingMachine', accessName: 'laundry room' },
];

/** Most property photos (upload area + thumbnails) */
export const MAX_PROPERTY_IMAGES = 10;

/** Map shown before an address is found (New York, the form's sample city) */
export const DEFAULT_MAP_POINT = { lat: 40.7128, lng: -74.006 };
export const MAP_ZOOM = { initial: 15, min: 11, max: 18, pinned: 17 };
