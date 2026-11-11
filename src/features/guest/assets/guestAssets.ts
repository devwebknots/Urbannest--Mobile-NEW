/**
 * Guest home design images.
 * hero_bg.png is the design's hero export with the baked-in headline,
 * button and dots removed (the app draws those as live UI).
 */
export const guestAssets = {
  hero: require('@/assets/images/guest/hero_bg.png'),
  // Extra hero slides, same 1170 x 1215 navy-sky layout (scripts/brand/hero_grade.ps1):
  // Unsplash 1600585154340 (dusk house) and 1613490493576 (pool villa, graded to blue hour)
  heroDuskHouse: require('@/assets/images/guest/hero_dusk_house.jpg'),
  heroPoolVilla: require('@/assets/images/guest/hero_pool_villa.jpg'),
  // Rental thumbnails reuse the sharp 1080px renter residence photos
  rentalBrotherHomes: require('@/assets/images/renter/residence_sterling.jpg'),
  rentalGlassVilla: require('@/assets/images/renter/residence_obsidian.jpg'),
  rentalCenterton: require('@/assets/images/renter/residence_azure.jpg'),
  guideLivingRoom: require('@/assets/images/guest/guide_living_room.png'),
  guideKitchen: require('@/assets/images/guest/guide_kitchen.png'),
  guideModernExterior: require('@/assets/images/guest/guide_modern_exterior.png'),
  // City tiles (Unsplash License), cropped to the tile shape (480 x 557):
  // NY 1485871981521, San Diego BhTgjLZ_v2U (Hakan Toker),
  // Philadelphia 1569761316261, Houston 1GQoJGCoRTw (Adrian Newell)
  cityNewYork: require('@/assets/images/guest/city_new_york.jpg'),
  citySanDiego: require('@/assets/images/guest/city_san_diego.jpg'),
  cityPhiladelphia: require('@/assets/images/guest/city_philadelphia.jpg'),
  cityHouston: require('@/assets/images/guest/city_houston.jpg'),
};

/** Width / height of the design images, so they display uncropped. */
export const GUEST_IMAGE_ASPECT = {
  hero: 1560 / 1620,
  rental: 448 / 384,
  guideFeatured: 1432 / 806,
  guideThumb: 696 / 338,
};

/**
 * Property details page art, cut from the "Luxury Home Rental" design:
 * floor_plan.png: the 3D floor plan from the Details card (1200 x 478),
 * text above it removed, baked "View Floor Plan" button painted out, top
 * and side edges faded so it melts into any card background.
 * Gallery interiors reuse the sharp renter room photos.
 */
export const propertyAssets = {
  floorPlan: require('@/assets/images/guest/floor_plan.png'),
  interiorLiving: require('@/assets/images/renter/area_living.jpg'),
  interiorBedroom: require('@/assets/images/renter/area_bedroom.jpg'),
  interiorDining: require('@/assets/images/renter/area_dining.jpg'),
  interiorOutside: require('@/assets/images/renter/area_outside.jpg'),
};

/** Width / height of the property details art */
export const PROPERTY_IMAGE_ASPECT = {
  floorPlan: 1200 / 478,
};

/**
 * Line icons for the property details page (Lucide, ISC licence; white
 * PNGs tinted in the app). Drawn at the renter-set weight:
 * scripts/icons/draw_line_icons.ps1 -OutDir src/assets/icons/property -Stroke 2.2
 */
export const propertyIcons = {
  arrowLeft: require('@/assets/icons/property/arrow_left.png'),
  share: require('@/assets/icons/property/share.png'),
  crown: require('@/assets/icons/property/crown.png'),
  house: require('@/assets/icons/property/house.png'),
  coins: require('@/assets/icons/property/database.png'),
  receipt: require('@/assets/icons/property/receipt.png'),
  shieldCheck: require('@/assets/icons/property/shield_check.png'),
  shield: require('@/assets/icons/property/shield.png'),
  sparkles: require('@/assets/icons/property/sparkles.png'),
  bus: require('@/assets/icons/property/bus.png'),
  calendar: require('@/assets/icons/property/calendar_days.png'),
  bolt: require('@/assets/icons/property/zap.png'),
  building: require('@/assets/icons/property/building.png'),
  document: require('@/assets/icons/property/note.png'),
  openExternal: require('@/assets/icons/property/open_external.png'),
  wallet: require('@/assets/icons/property/wallet.png'),
  layers: require('@/assets/icons/property/layers.png'),
};
