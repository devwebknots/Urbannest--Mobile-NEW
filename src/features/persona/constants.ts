/**
 * Persona carousel data and layout tokens.
 */

import { personaAssets, roleAssets } from './assets/personaAssets';
import type { PersonaRole, PersonaSlide } from './types';

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
      status: 'active',
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

/** Roles on the Add Persona page, in display order. */
export const PERSONA_ROLES: readonly PersonaRole[] = [
  {
    id: 'landlord',
    image: roleAssets.landlord,
    title: 'Landlord',
    eyebrow: 'Property owner',
    description:
      'Track rent, occupancy and owner statements across every home you own.',
    perks: ['Rent roll', 'Statements', 'Occupancy'],
    personaId: 'landlord',
    review: 'Within 24 hours',
  },
  {
    id: 'manager',
    image: roleAssets.manager,
    title: 'Property Manager',
    ctaName: 'Manager',
    eyebrow: 'Independent PM',
    description:
      'Run showings, inspections and vendor work orders from one command center.',
    perks: ['Showings', 'Inspections', 'Vendors'],
    personaId: 'manager',
    review: 'Within 24 hours',
  },
  {
    id: 'tenant',
    image: roleAssets.tenant,
    title: 'Tenant',
    eyebrow: 'Resident',
    description:
      'Pay rent, sign your lease and raise maintenance requests in seconds.',
    perks: ['Rent', 'Lease', 'Requests'],
    personaId: 'renter',
    review: 'Instant',
  },
  {
    id: 'pmsCompany',
    image: roleAssets.pmsCompany,
    title: 'PMS Company',
    eyebrow: 'Management firm',
    description:
      'Bring your managers, portfolios and vendor contracts into one company workspace.',
    perks: ['Team seats', 'Portfolios', 'Contracts'],
    review: '1 business day',
  },
  {
    id: 'agent',
    image: roleAssets.agent,
    title: 'Real Estate Agent',
    ctaName: 'Agent',
    eyebrow: 'Licensed agent',
    description:
      'List homes, book showings and follow every lead from first tour to signed lease.',
    perks: ['Listings', 'Showings', 'Leads'],
    review: '1 business day',
  },
  {
    id: 'admin',
    image: roleAssets.admin,
    title: 'UN Admin',
    ctaName: 'Admin',
    eyebrow: 'UrbanNest staff',
    description:
      'Oversee accounts, verifications and platform health across UrbanNest.',
    perks: ['Verifications', 'Accounts', 'Audit log'],
    review: 'Admin approval',
  },
];
