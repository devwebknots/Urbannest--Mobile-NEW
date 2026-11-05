/**
 * Persona carousel data and layout tokens.
 */

import { personaAssets } from './assets/personaAssets';
import type { PersonaSlide } from './types';

export const PERSONA_SLIDES: readonly PersonaSlide[] = [
  {
    kind: 'persona',
    persona: {
      id: 'renter',
      title: 'Renter',
      role: 'Main account',
      description:
        'Pay rent, track your lease and raise maintenance requests in seconds.',
      tags: ['Rent', 'Lease', 'Requests'],
      status: 'active',
      icon: 'home',
      image: personaAssets.renter,
    },
  },
  {
    kind: 'persona',
    persona: {
      id: 'landlord',
      title: 'Landlord',
      role: 'Property owner',
      description:
        'Follow rent roll, occupancy and owner statements across your portfolio.',
      tags: ['Portfolio', 'Income', 'Tenants'],
      status: 'inactive',
      icon: 'key',
      image: personaAssets.landlord,
    },
  },
  {
    kind: 'persona',
    persona: {
      id: 'manager',
      title: 'Property Manager',
      ctaName: 'PMS',
      role: 'Independent PM',
      description:
        'Run showings, inspections and vendor work orders from one command center.',
      tags: ['Showings', 'Inspections', 'Vendors'],
      status: 'active',
      icon: 'briefcase',
      image: personaAssets.manager,
    },
  },
  { kind: 'add', image: personaAssets.addPersona },
];

export const PERSONA_LAYOUT = {
  /** Gap between neighbouring cards */
  cardGap: 14,
  /** How far the photo slides inside its card while swiping */
  parallax: 36,
  /** Card width as a share of the screen width */
  cardWidthRatio: 0.74,
  cardMaxWidth: 340,
  /** Card height = width * ratio, capped by a share of screen height */
  cardAspect: 1.42,
  cardMaxHeightRatio: 0.56,
} as const;
