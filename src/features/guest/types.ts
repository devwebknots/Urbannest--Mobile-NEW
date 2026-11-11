import type { ImageSourcePropType } from 'react-native';

export type ListingMode = 'rent' | 'buy' | 'agents';

export type CategoryKey =
  | 'single'
  | 'multi'
  | 'apartments'
  | 'condos'
  | 'townhomes';

export interface Category {
  key: CategoryKey;
  label: string;
}

export interface FeaturedProperty {
  id: string;
  type: string;
  price: string;
  period: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  /** Poster shown until the video plays (and when it can't) */
  image: ImageSourcePropType;
  /** Looping, muted video tour that fills the card */
  video?: { uri: string };
}

export interface RentalListing {
  id: string;
  name: string;
  /** Shown before the price, e.g. "Starting at" */
  pricePrefix?: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  address: string;
  image: ImageSourcePropType;
  /** The image file already shows the Premium badge */
  badgeInImage?: boolean;
}

export interface Guide {
  id: string;
  title: string;
  audience: string;
  readTime: string;
  image: ImageSourcePropType;
}

export interface City {
  id: string;
  name: string;
  listings: string;
  image: ImageSourcePropType;
}

export type PropertyIconName =
  | 'arrowLeft'
  | 'share'
  | 'crown'
  | 'house'
  | 'coins'
  | 'receipt'
  | 'shieldCheck'
  | 'shield'
  | 'sparkles'
  | 'bus'
  | 'calendar'
  | 'bolt'
  | 'building'
  | 'document'
  | 'openExternal'
  | 'wallet'
  | 'layers';

/** One label / value line in Costs & Fees, e.g. "Pet rent : $50/Month" */
export interface CostRow {
  label: string;
  value: string;
}

/** A Costs & Fees group: "Rent & Fees", "Optional Charges", ... */
export interface CostGroup {
  id: string;
  title: string;
  icon: PropertyIconName;
  rows: CostRow[];
}

export interface PropertyFeature {
  id: string;
  label: string;
  icon: PropertyIconName;
}

/** Any listing a guest can open (Rentals Near You or Featured) */
export interface PropertySummary {
  id: string;
  name: string;
  address: string;
  /** e.g. "1,850 USD" */
  price: string;
  /** Shown before the price, e.g. "Starting at" */
  pricePrefix?: string;
  beds: string;
  baths: string;
  sqft: string;
  image: ImageSourcePropType;
}

/** Everything on the property details page */
export interface PropertyDetails extends PropertySummary {
  rating: number;
  reviews: number;
  premium: boolean;
  /** Hero photos: the listing photo first, then rooms */
  gallery: ImageSourcePropType[];
  description: string;
  floorPlan: ImageSourcePropType;
  costs: CostGroup[];
  features: PropertyFeature[];
}
