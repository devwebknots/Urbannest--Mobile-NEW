/**
 * useAddressLookup: address search + "Use current location" for one
 * address form on the rental application. Free, no API key: Photon on
 * OpenStreetMap data (src/services/places/addressSearch.ts).
 *  - `type(text)` as the user types in Street Address 1: after a short
 *    pause (3+ characters) US address suggestions load
 *  - `select(s)` fills the form from the chosen suggestion
 *  - `useCurrentLocation()` asks for location, looks the address up and
 *    fills the form
 * The form decides how to apply the address (`onResolved`).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';
import type { AppDialogConfig } from '@/components/AppDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { LocationError, getCurrentPosition } from '@/services/location/currentPosition';
import {
  AddressLookupError,
  AddressSuggestion,
  ParsedAddress,
  addressFromLocation,
  searchAddresses,
} from '@/services/places/addressSearch';

const MIN_CHARS = 3;

export type AddressLookupField = 'street1' | 'street2';

export function useAddressLookup(
  /** `from`: the street field the search came from (street2 → clear it) */
  onResolved: (address: ParsedAddress, from: AddressLookupField) => void,
  showDialog: (config: AppDialogConfig) => void,
  /** false: the form takes any country itself, so skip the "Outside the US" note */
  usOnly = true,
) {
  const [query, setQuery] = useState('');
  /** Which street field is searching (the list shows under it) */
  const [field, setField] = useState<AddressLookupField>('street1');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [locating, setLocating] = useState(false);
  const resolved = useRef(onResolved);
  resolved.current = onResolved;
  // Slightly longer pause than usual: kind to the free service
  const debounced = useDebounce(query, 400);

  // Load suggestions for what the user typed
  useEffect(() => {
    const text = debounced.trim();
    if (text.length < MIN_CHARS) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    searchAddresses(text, controller.signal)
      .then(setSuggestions)
      .catch(() => setSuggestions([]));
    return () => controller.abort();
  }, [debounced]);

  /**
   * Call on typing and on focus (with the field's current text), so a
   * field that already holds an address shows suggestions straight away.
   */
  const type = useCallback((text: string, from: AddressLookupField = 'street1') => {
    setField(from);
    setQuery(text);
  }, []);

  const close = useCallback(() => {
    setQuery('');
    setSuggestions([]);
  }, []);

  /** Non-US results: fill what fits, ask for the rest */
  const deliver = useCallback(
    (address: ParsedAddress, from: AddressLookupField = 'street1') => {
      resolved.current(address, from);
      if (usOnly && address.countryCode && address.countryCode !== 'US') {
        showDialog({
          tone: 'info',
          title: 'Outside the US',
          message: 'We filled in the street and city. Please choose the state and ZIP code yourself.',
          actions: [{ label: 'OK', variant: 'brand' }],
        });
      }
    },
    [showDialog, usOnly],
  );

  const select = useCallback(
    (s: AddressSuggestion) => {
      close();
      deliver(s.address, field);
    },
    [close, deliver, field],
  );

  const useCurrentLocation = useCallback(async () => {
    if (locating) {
      return;
    }
    close();
    setLocating(true);
    try {
      const { lat, lng } = await getCurrentPosition();
      deliver(await addressFromLocation(lat, lng));
    } catch (e) {
      if (e instanceof LocationError && (e.code === 'denied' || e.code === 'blocked')) {
        showDialog({
          tone: 'warning',
          title: 'Location is off',
          message: 'Allow location access to fill in your address automatically, or type it instead.',
          actions: [
            ...(e.code === 'blocked'
              ? [{ label: 'Open Settings', onPress: () => Linking.openSettings() }]
              : []),
            { label: 'Type It Instead', variant: 'link' as const },
          ],
        });
      } else if (e instanceof LocationError && (e.code === 'off' || e.code === 'timeout')) {
        showDialog({
          tone: 'info',
          title: e.code === 'off' ? 'Turn on Location' : "Couldn't get your location",
          message:
            e.code === 'off'
              ? "Your phone's Location is switched off. Turn it on to fill in your address."
              : 'Your location took too long to load. Make sure Location is on, then try again.',
          actions: [
            {
              label: 'Open Location Settings',
              onPress: () =>
                (Platform.OS === 'android'
                  ? Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
                  : Linking.openSettings()
                ).catch(() => Linking.openSettings()),
            },
            { label: 'Type It Instead', variant: 'link' },
          ],
        });
      } else {
        showDialog({
          tone: 'info',
          title: "Couldn't find your address",
          message:
            e instanceof AddressLookupError && e.code === 'not-found'
              ? 'No street address was found at your location. Please type it instead.'
              : 'Check your connection and location, then try again, or type your address.',
          actions: [{ label: 'OK', variant: 'brand' }],
        });
      }
    } finally {
      setLocating(false);
    }
  }, [close, deliver, locating, showDialog]);

  return { suggestions, field, type, close, select, useCurrentLocation, locating };
}

export type AddressLookup = ReturnType<typeof useAddressLookup>;
