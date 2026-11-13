/**
 * journeyStore: in-memory record of the journey steps the renter finished
 * on their own pages (offer accepted, lease confirmed), keyed by
 * application + step. Application Details subscribes (useJourneyStore) so
 * its journey moves on to the next step. Same pattern as
 * inspectionAreaStore; replace with the backend API later.
 */

import { useSyncExternalStore } from 'react';

/** Steps finished in the app (agreement: owner side, demo timer for now) */
export type RenterStepId = 'offer' | 'review' | 'agreement' | 'payment';

const done = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

const key = (applicationId: string, step: RenterStepId) => `${applicationId}:${step}`;

const changed = () => {
  version += 1;
  listeners.forEach(listener => listener());
};

export const journeyStore = {
  isDone: (applicationId: string, step: RenterStepId): boolean =>
    done.has(key(applicationId, step)),
  complete: (applicationId: string, step: RenterStepId): void => {
    const k = key(applicationId, step);
    if (!done.has(k)) {
      done.add(k);
      changed();
    }
  },
  /** Clears everything (tests) */
  reset: (): void => {
    done.clear();
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

/** Re-renders the caller whenever a step is finished */
export function useJourneyStore(): number {
  return useSyncExternalStore(journeyStore.subscribe, journeyStore.getVersion);
}
