/**
 * Renter feature types.
 */

import type { ImageSourcePropType } from 'react-native';

export type LeaseStatus = 'moveInReady' | 'active' | 'expired';

export type ResidenceFilter = 'all' | 'current' | 'past';

export interface ResidenceMeta {
  readonly label: string;
  readonly value: string;
  readonly icon: 'calendar' | 'clock';
}

export interface Residence {
  readonly id: string;
  readonly name: string;
  /** Suite / unit line, e.g. "Suite 402" */
  readonly unit: string;
  /** Monthly rent, e.g. "$3,200" */
  readonly rent: string;
  readonly street: string;
  readonly city: string;
  readonly status: LeaseStatus;
  readonly premium?: boolean;
  /** Footer facts, e.g. renewal date, tenure */
  readonly meta: readonly ResidenceMeta[];
  readonly image: ImageSourcePropType;
}

export type RenterTab = 'residences' | 'search' | 'alerts' | 'calendar';

/* ---------- Residence dashboard ---------- */

export type ConciergeIcon = 'wrench' | 'invoice' | 'amenities' | 'folder' | 'lease';

export type ConciergeAccent = 'amber' | 'blue' | 'green' | 'violet' | 'navy';

export interface ConciergeService {
  readonly id: string;
  readonly label: string;
  readonly icon: ConciergeIcon;
  /** Short helper line under the label */
  readonly hint: string;
  /** Icon tint (theme status / avatar palettes) */
  readonly accent: ConciergeAccent;
}

export interface FinancialSummary {
  readonly rentDue: string;
  readonly dueIn: string;
  readonly hoaFee: string;
  readonly hoaScheduled: string;
}

export interface ServiceRequest {
  readonly id: string;
  readonly category: string;
  readonly title: string;
  readonly ticket: string;
  readonly opened: string;
  readonly status: 'In Progress' | 'Scheduled' | 'Resolved';
}

export interface CommunityEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly month: string;
  readonly day: string;
  /** Initials of a few attendees shown as avatars */
  readonly attendees: readonly string[];
  readonly moreCount: number;
  readonly attendingLabel: string;
  readonly image: ImageSourcePropType;
}

/* ---------- Check-in (move-in) ---------- */

export type CheckInIcon = 'inspect' | 'bolt' | 'wifi' | 'shield';

export interface CheckInTask {
  readonly id: string;
  readonly label: string;
  /** Short helper line under the label */
  readonly hint: string;
  readonly icon: CheckInIcon;
  readonly accent: ConciergeAccent;
  /**
   * Set when the item is completed on its own screen. Tapping the tile opens
   * that screen; the tile only ticks once that screen is submitted.
   */
  readonly screen?: 'InspectionArea' | 'Utilities';
}

/* ---------- Utilities (move-in) ---------- */

export type UtilityIcon = 'bolt' | 'faucet' | 'flame' | 'waves';

/** A company that supplies one utility at the residence (mock; later from the backend) */
export interface UtilityProvider {
  readonly id: string;
  readonly name: string;
  /** Kind of provider, e.g. "Investor-owned utility" */
  readonly kind: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly accent: ConciergeAccent;
  /** Square thumbnail next to the name (later the provider's logo) */
  readonly image: ImageSourcePropType;
  readonly phone: string;
  /** 24/7 outage / leak line, when the provider has one */
  readonly emergency?: string;
  /** Full URL, opened in the browser */
  readonly website: string;
  readonly hours: string;
}

/** One utility on the Utilities page (Electricity, Water, ...) */
export interface UtilityService {
  readonly id: string;
  readonly label: string;
  /** One line on the utility card */
  readonly hint: string;
  /** Intro under the title on the providers page */
  readonly description: string;
  readonly icon: UtilityIcon;
  readonly image: ImageSourcePropType;
  readonly providers: readonly UtilityProvider[];
}

/** One room / area on the move-in inspection page */
export interface InspectionArea {
  readonly id: string;
  readonly label: string;
  /** What to check, e.g. "Walls, floors & windows" */
  readonly hint: string;
  readonly image: ImageSourcePropType;
}

/** Issue category in the area page's dropdown, e.g. "Walls & Paint" */
export interface IssueCategory {
  readonly id: string;
  readonly label: string;
}

/** Photo or video attached to an issue (local file from camera / gallery) */
export interface IssueMedia {
  readonly uri: string;
  readonly type: 'photo' | 'video';
}

/** One issue reported for an area during the move-in inspection */
export interface InspectionIssue {
  readonly id: string;
  readonly categoryId: string;
  readonly description: string;
  readonly media: readonly IssueMedia[];
}

/** Area result: "allGood" (no issues) or "issues" (at least one issue) */
export type AreaStatus = 'unset' | 'allGood' | 'issues';

export interface CheckInSummary {
  readonly leaseId: string;
  readonly moveInDate: string;
  readonly keyWindow: string;
  readonly description: string;
}

export type NeighborhoodIcon = 'school' | 'hospital' | 'park';

export interface NeighborhoodPlace {
  readonly name: string;
  readonly meta: string;
  readonly distance: string;
  readonly image: ImageSourcePropType;
}

export interface NeighborhoodCategory {
  readonly id: string;
  readonly title: string;
  readonly icon: NeighborhoodIcon;
  readonly accent: ConciergeAccent;
  readonly places: readonly NeighborhoodPlace[];
}
