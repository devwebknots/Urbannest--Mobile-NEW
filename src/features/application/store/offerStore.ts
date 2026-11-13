/**
 * offerStore: in-memory record of which applications' lease offers the
 * renter accepted (Offer Acceptance page). Application Details subscribes
 * (useOfferStore) so its journey moves on to Lease Review once accepted.
 * Same pattern as inspectionAreaStore; replace with the backend API later.
 */

import { useSyncExternalStore } from 'react';

const accepted = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

const changed = () => {
  version += 1;
  listeners.forEach(listener => listener());
};

export const offerStore = {
  isAccepted: (applicationId: string): boolean => accepted.has(applicationId),
  accept: (applicationId: string): void => {
    if (!accepted.has(applicationId)) {
      accepted.add(applicationId);
      changed();
    }
  },
  /** Clears everything (tests) */
  reset: (): void => {
    accepted.clear();
    changed();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getVersion: () => version,
};

/** Re-renders the caller whenever an offer is accepted */
export function useOfferStore(): number {
  return useSyncExternalStore(offerStore.subscribe, offerStore.getVersion);
}
