/**
 * Persona feature types.
 */

import type { ImageSourcePropType } from 'react-native';

export type PersonaStatus = 'active' | 'inactive';

export type PersonaIcon = 'home' | 'key' | 'briefcase';

export interface Persona {
  readonly id: string;
  readonly title: string;
  /** Shorter name for the continue button, e.g. "PMS" */
  readonly ctaName?: string;
  /** Short role line, e.g. "Main account" */
  readonly role: string;
  readonly description: string;
  /** Small feature chips shown on the card */
  readonly tags: readonly string[];
  readonly status: PersonaStatus;
  readonly icon: PersonaIcon;
  readonly image: ImageSourcePropType;
}

/** One page of the carousel: a persona, or the "Add persona" card. */
export type PersonaSlide =
  | { readonly kind: 'persona'; readonly persona: Persona }
  | { readonly kind: 'add'; readonly image: ImageSourcePropType };

/** One role the user can add on the Add Persona page. */
export interface PersonaRole {
  readonly id: string;
  readonly title: string;
  /** Shorter name for the button, e.g. "Agent" */
  readonly ctaName?: string;
  /** Short role line, e.g. "Property owner" */
  readonly eyebrow: string;
  readonly description: string;
  /** Three things the role unlocks */
  readonly perks: readonly string[];
  /** Small round photo that shows the role (keys, laptop, villa…) */
  readonly image: ImageSourcePropType;
  /** Persona id already on the account (opens its dashboard), if any */
  readonly personaId?: string;
  /** Review time shown when a new role is requested */
  readonly review: string;
}
