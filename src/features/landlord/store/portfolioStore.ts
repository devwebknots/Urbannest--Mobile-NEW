/**
 * portfolioStore: in-memory flag for the demo flow. Add New Property →
 * Unit → "Save Unit & Send Invite" marks the portfolio as filled, and the
 * Portfolio Overview (usePortfolioPopulated) swaps its "No properties found"
 * card for the sample Managed Assets list. Same pattern as journeyStore;
 * replace with the backend API later.
 */

import { useSyncExternalStore } from 'react';

let populated = false;
const listeners = new Set<() => void>();

export const portfolioStore = {
  isPopulated: (): boolean => populated,
  /** First property saved: show the sample portfolio */
  populate: (): void => {
    if (!populated) {
      populated = true;
      listeners.forEach(listener => listener());
    }
  },
  /** Back to the empty portfolio (tests) */
  reset: (): void => {
    populated = false;
    listeners.forEach(listener => listener());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** True once a property has been saved; re-renders when that changes */
export function usePortfolioPopulated(): boolean {
  return useSyncExternalStore(portfolioStore.subscribe, portfolioStore.isPopulated);
}
