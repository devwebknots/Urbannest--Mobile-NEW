/**
 * Landlord dashboard art and icons.
 * Photos are cropped from the "UrbanNest Landlord Dashboard Overview" design:
 * header_building.png (1200 x 600): the full dusk building supplied by the
 * user ("image 72.png", 7096 x 3548), scaled down; alpha feathered on the
 * left / top / bottom (right edge opaque: it sits on the screen edge) so it
 * melts into the indigo hero with no square edge and the base is not cut;
 * asset_*.jpg (308 x 149): the three Prime Assets property photos.
 */
export const landlordAssets = {
  headerBuilding: require('@/assets/images/landlord/header_building.png'),
  regentPlaza: require('@/assets/images/landlord/asset_regent_plaza.jpg'),
  emeraldGardens: require('@/assets/images/landlord/asset_emerald_gardens.jpg'),
  oakridge: require('@/assets/images/landlord/asset_oakridge.jpg'),
  // Portfolio Overview "No properties found" card: the room photo cropped
  // from the "Portfolio Overview" design (620 x 423, text left out)
  emptyPropertiesRoom: require('@/assets/images/landlord/empty_properties_room.jpg'),
};

/** Width / height of header_building.png */
export const HEADER_BUILDING_ASPECT = 1200 / 600;

/** Width / height of the asset_*.jpg photos */
export const ASSET_PHOTO_ASPECT = 308 / 149;

/**
 * Line icons (Lucide, ISC licence; white PNGs tinted in the app), drawn at
 * the renter weight by scripts/icons/draw_line_icons.ps1
 * -OutDir src/assets/icons/landlord -Stroke 2.2 (list in the script).
 */
export const landlordIcons = {
  building: require('@/assets/icons/landlord/building.png'),
  layers: require('@/assets/icons/landlord/layers.png'),
  users: require('@/assets/icons/landlord/users.png'),
  plus: require('@/assets/icons/landlord/plus.png'),
  house: require('@/assets/icons/landlord/house.png'),
  database: require('@/assets/icons/landlord/database.png'),
  fileText: require('@/assets/icons/landlord/file_text.png'),
  alert: require('@/assets/icons/landlord/alert.png'),
  mapPin: require('@/assets/icons/landlord/map_pin.png'),
  download: require('@/assets/icons/landlord/download.png'),
  crown: require('@/assets/icons/landlord/crown.png'),
  shieldCheck: require('@/assets/icons/landlord/shield_check.png'),
  sparkles: require('@/assets/icons/landlord/sparkles.png'),
  tools: require('@/assets/icons/landlord/tools.png'),
  message: require('@/assets/icons/landlord/message_square.png'),
  bell: require('@/assets/icons/landlord/bell.png'),
  help: require('@/assets/icons/landlord/circle_help.png'),
  tag: require('@/assets/icons/landlord/tag.png'),
  chart: require('@/assets/icons/landlord/chart_column.png'),
  chevronRight: require('@/assets/icons/landlord/chevron_right.png'),
  chevronDown: require('@/assets/icons/landlord/chevron_down.png'),
  arrowRight: require('@/assets/icons/landlord/arrow_right.png'),
  arrowUp: require('@/assets/icons/landlord/arrow_up.png'),
  clipboard: require('@/assets/icons/landlord/clipboard_list.png'),
  fileClock: require('@/assets/icons/landlord/file_clock.png'),
  circleDot: require('@/assets/icons/landlord/circle_dot.png'),
  target: require('@/assets/icons/landlord/target.png'),
  folder: require('@/assets/icons/landlord/folder.png'),
  lightbulb: require('@/assets/icons/landlord/lightbulb.png'),
  menu: require('@/assets/icons/landlord/menu.png'),
};
