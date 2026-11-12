/**
 * currentPosition: asks for location permission (Android runtime prompt;
 * iOS shows its own on first use) and returns the device's coordinates.
 * Uses @react-native-community/geolocation (native; rebuild after install).
 *
 * Speed: a street address doesn't need GPS precision, so it first asks for
 * a quick fix (Google Play fused location / Wi-Fi + cell, or a fix from the
 * last few minutes). Only if that times out does it try GPS once. A
 * high-accuracy-only request often never resolves indoors.
 */

import Geolocation, { GeolocationError } from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

export type LocationErrorCode = 'denied' | 'blocked' | 'off' | 'unavailable' | 'timeout';

export class LocationError extends Error {
  constructor(readonly code: LocationErrorCode) {
    super(code);
  }
}

let configured = false;
const configure = () => {
  if (configured) {
    return;
  }
  configured = true;
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    // Play Services fused location when available (fast), else Android's own
    locationProvider: 'auto',
  });
};

async function ensurePermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    throw new LocationError('blocked');
  }
  if (result !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new LocationError('denied');
  }
}

const toError = (err: GeolocationError) => {
  // 1 PERMISSION_DENIED, 2 POSITION_UNAVAILABLE (often: Location switched off), 3 TIMEOUT
  if (err.code === 1) {
    return new LocationError('denied');
  }
  if (err.code === 3) {
    return new LocationError('timeout');
  }
  return new LocationError(/disabled|off|provider/i.test(err.message ?? '') ? 'off' : 'unavailable');
};

const position = (highAccuracy: boolean, timeout: number) =>
  new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(toError(err)),
      {
        enableHighAccuracy: highAccuracy,
        timeout,
        // A fix from the last 5 minutes is fine for a street address
        maximumAge: 5 * 60 * 1000,
      },
    );
  });

export async function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  configure();
  await ensurePermission();
  try {
    return await position(false, 8000);
  } catch (e) {
    if (e instanceof LocationError && e.code === 'timeout') {
      // No quick fix (e.g. no network location): try GPS once
      return position(true, 15000);
    }
    throw e;
  }
}
