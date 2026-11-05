/**
 * Persona feature types.
 */

import type { ImageSourcePropType } from 'react-native';

export type PersonaStatus = 'active' | 'inactive';

export type PersonaIcon = 'home' | 'key' | 'briefcase';

export interface Persona {
  readonly id: string;
  readonly title: string;
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
