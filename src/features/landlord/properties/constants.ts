/**
 * Add New Property ("Property Basic Information") options.
 */

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

export const PROPERTY_AMENITIES: readonly string[] = [
  'Parking',
  'Elevator',
  'Gym',
  'Swimming Pool',
  'Laundry',
  'Security',
  '24/7 Water',
  'Power Backup',
  'Garden',
  'Clubhouse',
  'Pet Friendly',
  'EV Charging',
];

/** Extra photos besides the main image */
export const EXTRA_IMAGE_SLOTS = 3;

/** Map shown before an address is found (New York, the form's sample city) */
export const DEFAULT_MAP_POINT = { lat: 40.7128, lng: -74.006 };
export const MAP_ZOOM = { initial: 15, min: 11, max: 18 };
