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

/* ───────────── Unit tab ("Unit / Home Information") ───────────── */

export const UNIT_TYPES: readonly { id: string; label: string }[] = [
  { id: 'studio', label: 'Studio' },
  { id: '1br', label: '1 BR' },
  { id: '2br', label: '2 BR' },
  { id: '3br', label: '3 BR' },
  { id: '4br', label: '4 BR+' },
  { id: 'studentRoom', label: 'Student Room' },
  { id: 'serviced', label: 'Serviced' },
  { id: 'commercial', label: 'Commercial' },
];

export const LEASE_TYPES: readonly { id: string; label: string }[] = [
  { id: 'fixed', label: 'Fixed Term (12 Months)' },
  { id: 'monthly', label: 'Month-to-Month' },
  { id: 'short', label: 'Short Term' },
  { id: 'corporate', label: 'Corporate Lease' },
];

export const MANAGEMENT_MODELS: readonly { id: string; label: string }[] = [
  { id: 'self', label: 'Self-Managed' },
  { id: 'manager', label: 'Property Manager' },
  { id: 'co', label: 'Co-Managed' },
];

/** "Unit Types Guide": the design's 5 items (left column, then right) */
export const UNIT_TYPE_GUIDE: readonly {
  title: string;
  body: string;
  icon: 'bed' | 'graduationCap' | 'conciergeBell' | 'store';
}[] = [
  { title: 'Studio', body: 'Open plan, no separate bedroom', icon: 'bed' },
  { title: '1BR–4BR+', body: 'Bedroom count', icon: 'bed' },
  { title: 'Student Room', body: 'Per-room bed config', icon: 'graduationCap' },
  { title: 'Serviced', body: 'Hotel-style amenities', icon: 'conciergeBell' },
  { title: 'Commercial', body: 'Non-residential use', icon: 'store' },
];

/** Floor plan drawings: dashed slots under the upload area */
export const MAX_FLOOR_PLANS = 3;

/* ───────────── Unit → Student housing rooms ───────────── */

export const ROOM_TYPES: readonly { id: string; label: string }[] = [
  { id: 'single', label: 'Single' },
  { id: 'double', label: 'Double' },
  { id: 'triple', label: 'Triple' },
  { id: 'quad', label: 'Quad' },
];

export const BATHROOM_TYPES: readonly { id: string; label: string }[] = [
  { id: 'attached', label: 'Attached' },
  { id: 'shared', label: 'Shared' },
  { id: 'common', label: 'Common' },
];

/** First one is the default for a new room ("DEFAULT" tag) */
export const ROOM_STATUSES: readonly { id: string; label: string }[] = [
  { id: 'vacant', label: 'Vacant' },
  { id: 'occupied', label: 'Occupied' },
  { id: 'reserved', label: 'Reserved' },
  { id: 'maintenance', label: 'Under Maintenance' },
];

export const BED_TYPES: readonly { id: string; label: string }[] = [
  { id: 'single', label: 'Single Bed' },
  { id: 'bunk', label: 'Bunk Bed' },
  { id: 'double', label: 'Double Bed' },
];

/** Stepper limits in Add Room */
export const MAX_ROOM_BEDS = 8;
export const MAX_ROOM_BATHS = 4;
