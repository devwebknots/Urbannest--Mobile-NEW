/**
 * Residence photos, cut from the "Tenant - Home Page - Property" design
 * (badges and rounded corners removed; the app draws those as live UI).
 * residences_header.jpg: header art — the design's own dusk-house image
 * (012.png), fitted to width; the bottom fades navy -> light blue -> pageTint
 * using colours sampled from the "Residences Dashboard" mockup, so the
 * filter bar sits on the pale band like in the design.
 */
export const renterAssets = {
  header: require('@/assets/images/renter/residences_header.jpg'),
  obsidian: require('@/assets/images/renter/residence_obsidian.jpg'),
  sterling: require('@/assets/images/renter/residence_sterling.jpg'),
  azure: require('@/assets/images/renter/residence_azure.jpg'),
  marble: require('@/assets/images/renter/residence_marble.jpg'),
  // Dashboard event photo (Unsplash 1572116469696)
  eventSkyLounge: require('@/assets/images/renter/event_sky_lounge.jpg'),
};

/** Line icons drawn for the dashboard (white PNGs, tinted in the app). */
export const renterIcons = {
  wrench: require('@/assets/icons/renter/wrench.png'),
  invoice: require('@/assets/icons/renter/invoice.png'),
  amenities: require('@/assets/icons/renter/amenities.png'),
  folder: require('@/assets/icons/renter/folder.png'),
  lease: require('@/assets/icons/renter/lease.png'),
  bank: require('@/assets/icons/renter/bank.png'),
  faucet: require('@/assets/icons/renter/faucet.png'),
};

/** Width / height of residences_header.jpg */
export const RENTER_HEADER_ASPECT = 1290 / 1150;
