/**
 * inspectionAreaStore: in-memory record of each area's saved result
 * (all good / issues), keyed by residence + area. Screens subscribe to it
 * (useInspectionAreaStore) so the Inspection page and the room stepper
 * show which areas are done. Replace with the backend API later.
 */

import { useSyncExternalStore } from 'react';
import type { AreaStatus, InspectionIssue } from '../types';

export interface AreaRecord {
  readonly status: AreaStatus;
  readonly issues: readonly InspectionIssue[];
}

const records = new Map<string, AreaRecord>();
const listeners = new Set<() => void>();
let version = 0;

const key = (residenceId: string, areaId: string) => `${residenceId}:${areaId}`;

const changed = () => {
  version += 1;
  listeners.forEach(listener => listener());
};

export const inspectionAreaStore = {
  get: (residenceId: string, areaId: string): AreaRecord | undefined =>
    records.get(key(residenceId, areaId)),
  isDone: (residenceId: string, areaId: string): boolean =>
    records.has(key(residenceId, areaId)),
  save: (residenceId: string, areaId: string, record: AreaRecord): void => {
    records.set(key(residenceId, areaId), record);
    changed();
  },
  /** Marks an area as not done again */
  remove: (residenceId: string, areaId: string): void => {
    if (records.delete(key(residenceId, areaId))) {
      changed();
    }
  },
  /** Clears everything (tests) */
  reset: (): void => {
    records.clear();
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

/** Re-renders the caller whenever an area result is saved */
export function useInspectionAreaStore(): number {
  return useSyncExternalStore(inspectionAreaStore.subscribe, inspectionAreaStore.getVersion);
}
