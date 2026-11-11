/**
 * usePropertyDetails: state and actions for the guest property details
 * page. Any guest listing can be opened (Rentals Near You or Featured);
 * the page shows its photo, price and stats with the design's shared
 * details (costs, features, rating).
 * Apply / Book a Tour need an account, so they offer Log In / Sign Up.
 */

import { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import { propertyAssets } from '../assets/guestAssets';
import {
  FEATURED_PROPERTIES,
  PROPERTY_COSTS,
  PROPERTY_FEATURES,
  PROPERTY_GALLERY_ROOMS,
  PROPERTY_RATING,
  RENTALS_NEAR_YOU,
} from '../constants';
import type { PropertyDetails, PropertySummary } from '../types';

export interface PropertyDetailsNavigation {
  goBack: () => void;
  navigate?: (route: 'PersonaSelect') => void;
  /** Opens another listing on top (Similar Deals) */
  push?: (route: 'PropertyDetails', params: { propertyId: string }) => void;
}

/** "$ 1,850" -> "1,850 USD" (featured prices already read "2,450 USD") */
const toUsd = (price: string) =>
  price.includes('USD') ? price : `${price.replace(/[$\s]/g, '')} USD`;

/** Every listing a guest can open, in one shape */
export const GUEST_LISTINGS: PropertySummary[] = [
  ...RENTALS_NEAR_YOU.map(r => ({
    id: r.id,
    name: r.name,
    address: r.address,
    price: toUsd(r.price),
    pricePrefix: r.pricePrefix,
    beds: r.beds,
    baths: r.baths,
    sqft: r.sqft,
    image: r.image,
  })),
  ...FEATURED_PROPERTIES.map(f => ({
    id: f.id,
    name: f.type,
    address: f.address,
    price: toUsd(f.price),
    beds: `${f.beds} Bed`,
    baths: `${f.baths} Bath`,
    sqft: `${f.sqft} Sq Ft`,
    image: f.image,
  })),
];

/** City from "5960 W 85th Pl, Los Angeles, California(CA), 90045" */
const cityOf = (address: string) => address.split(',')[1]?.trim() ?? address;

const buildDetails = (listing: PropertySummary): PropertyDetails => ({
  ...listing,
  ...PROPERTY_RATING,
  premium: true,
  gallery: [listing.image, ...PROPERTY_GALLERY_ROOMS],
  // Short version of the design's description, filled in for this listing
  description:
    `A fully furnished ${listing.beds.toLowerCase()} home in ${cityOf(listing.address)} ` +
    `with ${listing.sqft.toLowerCase()} of thoughtfully designed space and all ` +
    'built-in amenities for modern living.',
  floorPlan: propertyAssets.floorPlan,
  costs: PROPERTY_COSTS,
  features: PROPERTY_FEATURES,
});

export function usePropertyDetails(propertyId?: string, navigation?: PropertyDetailsNavigation) {
  const property = useMemo(
    () => buildDetails(GUEST_LISTINGS.find(l => l.id === propertyId) ?? GUEST_LISTINGS[0]),
    [propertyId],
  );
  const similar = useMemo(
    () => GUEST_LISTINGS.filter(l => l.id !== property.id),
    [property.id],
  );

  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Costs & Fees estimator: optional extras the guest added (by label)
  const [extras, setExtras] = useState<Set<string>>(() => new Set());
  const toggleExtra = useCallback((label: string) => {
    setExtras(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const share = useCallback(() => {
    Share.share({
      title: property.name,
      message: `${property.name} · ${property.price} / Month\n${property.address}`,
    }).catch(() => {});
  }, [property]);

  const openProperty = useCallback(
    (id: string) => {
      if (navigation?.push) {
        navigation.push('PropertyDetails', { propertyId: id });
      } else {
        navigate('PropertyDetails', { propertyId: id });
      }
    },
    [navigation],
  );

  const goToSignIn = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate('PersonaSelect');
    } else {
      navigate('PersonaSelect');
    }
  }, [navigation]);

  // Guests need an account to apply or book a tour
  const needAccount = useCallback(
    (title: string, message: string) =>
      showDialog({
        tone: 'info',
        title,
        message,
        actions: [
          { label: 'Log In / Sign Up', variant: 'brand', onPress: goToSignIn },
          { label: 'Not now', variant: 'link' },
        ],
      }),
    [goToSignIn, showDialog],
  );

  const apply = useCallback(
    () =>
      needAccount(
        `Apply for ${property.name}`,
        'Log in or create an account to send your rental application.',
      ),
    [needAccount, property.name],
  );

  const bookTour = useCallback(
    () =>
      needAccount(
        'Book a Tour',
        `Log in or create an account to pick a time to visit ${property.name}.`,
      ),
    [needAccount, property.name],
  );

  const seeAllSimilar = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Similar Deals',
        message: 'The full list is coming soon.',
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [showDialog],
  );

  return {
    property,
    similar,
    favorites,
    toggleFavorite,
    extras,
    toggleExtra,
    floorPlanOpen,
    openFloorPlan: () => setFloorPlanOpen(true),
    closeFloorPlan: () => setFloorPlanOpen(false),
    back,
    share,
    openProperty,
    apply,
    bookTour,
    seeAllSimilar,
    dialog: dialog.props,
  };
}
