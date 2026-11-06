/**
 * Guest home design images.
 * hero_bg.png is the design's hero export with the baked-in headline,
 * button and dots removed (the app draws those as live UI).
 */
export const guestAssets = {
  hero: require('@/assets/images/guest/hero_bg.png'),
  rentalBrotherHomes: require('@/assets/images/guest/rental_brother_homes.png'),
  // Note: this export already includes the "Premium" badge
  rentalGlassVilla: require('@/assets/images/guest/rental_glass_villa.png'),
  rentalCenterton: require('@/assets/images/guest/rental_centerton.png'),
  guideLivingRoom: require('@/assets/images/guest/guide_living_room.png'),
  guideKitchen: require('@/assets/images/guest/guide_kitchen.png'),
  guideModernExterior: require('@/assets/images/guest/guide_modern_exterior.png'),
};

/** Width / height of the design images, so they display uncropped. */
export const GUEST_IMAGE_ASPECT = {
  hero: 1560 / 1620,
  rental: 448 / 384,
  guideFeatured: 1432 / 806,
  guideThumb: 696 / 338,
};
