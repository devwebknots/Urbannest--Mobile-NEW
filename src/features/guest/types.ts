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
  image: string;
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
  image: string;
}

export interface Guide {
  id: string;
  title: string;
  audience: string;
  readTime: string;
  image: string;
}

export interface City {
  id: string;
  name: string;
  listings: string;
  image: string;
}
