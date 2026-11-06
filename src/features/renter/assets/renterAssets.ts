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
};

/** Width / height of residences_header.jpg */
export const RENTER_HEADER_ASPECT = 1290 / 1150;
