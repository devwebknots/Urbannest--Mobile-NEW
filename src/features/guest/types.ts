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
  image: ImageSourcePropType;
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
