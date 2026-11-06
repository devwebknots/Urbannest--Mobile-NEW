/**
 * Guest home content. Design images live in assets/guestAssets; the
 * featured carousel and city tiles still use remote placeholders.
 */

import { guestAssets } from './assets/guestAssets';
import type {
  Category,
  City,
  FeaturedProperty,
  Guide,
  RentalListing,
} from './types';

const unsplash = (id: string, w = 800) => ({
  uri: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`,
});

// One slide per page dot. Only the first slide has a design image so far.
export const HERO_IMAGES = [guestAssets.hero, guestAssets.heroDuskHouse, guestAssets.heroPoolVilla];

export const SEARCH_FILTERS = {
  location: 'California',
  budget: '$2,000 - $3,000',
  rentalType: 'Single Family',
  bedrooms: '3 Bed',
};

export const CATEGORIES: Category[] = [
  { key: 'single', label: 'Single Family' },
  { key: 'multi', label: 'Multi Family' },
  { key: 'apartments', label: 'Apartments' },
  { key: 'condos', label: 'Condos' },
  { key: 'townhomes', label: 'Town Homes' },
];

export const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: 'f1',
    type: 'Modern Villa',
    price: '2,450 USD',
    period: '/Month',
    address: '210 Ocean Ave, Santa Monica, California(CA), 90402',
    beds: 4,
    baths: 3,
    sqft: 2140,
    image: unsplash('1600585154340-be6161a56a0c'),
  },
  {
    id: 'f2',
    type: 'Single Home',
    price: '1,200 USD',
    period: '/Month',
    address: '5960 W 85th Pl, Los Angeles, California(CA), 90045',
    beds: 2,
    baths: 2,
    sqft: 1056,
    image: unsplash('1564013799919-ab600027ffc6'),
  },
  {
    id: 'f3',
    type: 'Family House',
    price: '1,850 USD',
    period: '/Month',
    address: '88 Elm St, Pasadena, California(CA), 91101',
    beds: 3,
    baths: 2,
    sqft: 1480,
    image: unsplash('1568605114967-8130f3a36994'),
  },
];

export const RENTALS_NEAR_YOU: RentalListing[] = [
  {
    id: 'r1',
    name: 'Brother Homes',
    price: '$ 1,850',
    beds: '3 Bed',
    baths: '2 Bath',
    sqft: '1056 Sq Ft',
    address: '482 Pecan Grove Ln, Austin, TX 78701',
    image: guestAssets.rentalBrotherHomes,
  },
  {
    id: 'r2',
    name: 'Glass Villa Retreat',
    price: '$ 1,600',
    beds: '3 Bed',
    baths: '2 Bath',
    sqft: '1056 Sq Ft',
    address: '617 Live Oak Cir, Austin, TX 78701',
    image: guestAssets.rentalGlassVilla,
    badgeInImage: true,
  },
  {
    id: 'r3',
    name: 'Centerton Apartments',
    pricePrefix: 'Starting at',
    price: '$ 1,560',
    beds: '1-3 Bed',
    baths: '2-4 Bath',
    sqft: '1780-2100 SqFt',
    address: '1203 Bluebonnet Trl, Austin, TX 78701',
    image: guestAssets.rentalCenterton,
  },
];

export const FEATURED_GUIDE: Guide = {
  id: 'g1',
  title: '5 Ways to Improve\nYour Rental Listing',
  audience: 'Landlords',
  readTime: '3 min read',
  image: guestAssets.guideLivingRoom,
};

export const GUIDES: Guide[] = [
  {
    id: 'g2',
    title: 'Renting Your First Home: What to Know',
    audience: 'Renters',
    readTime: '4 min read',
    image: guestAssets.guideKitchen,
  },
  {
    id: 'g3',
    title: 'How to Market a Property Effectively',
    audience: 'Property Owners',
    readTime: '5 min read',
    image: guestAssets.guideModernExterior,
  },
];

export const TOP_CITIES: City[] = [
  {
    id: 'c1',
    name: 'New York',
    listings: '12,000+',
    image: guestAssets.cityNewYork,
  },
  {
    id: 'c2',
    name: 'San Diego',
    listings: '8,200+',
    image: guestAssets.citySanDiego,
  },
  {
    id: 'c3',
    name: 'Philadelphia',
    listings: '6,400+',
    image: guestAssets.cityPhiladelphia,
  },
  {
    id: 'c4',
    name: 'Houston',
    listings: '9,100+',
    image: guestAssets.cityHouston,
  },
];

export const TRUST_POINTS = [
  {
    key: 'verified',
    title: 'Verified Listings',
    subtitle: 'Genuine & up-to-date properties',
  },
  {
    key: 'secure',
    title: 'Secure & Transparent',
    subtitle: 'Safe transactions & clear details',
  },
  {
    key: 'support',
    title: 'Dedicated Support',
    subtitle: 'Always here to help you',
  },
] as const;
