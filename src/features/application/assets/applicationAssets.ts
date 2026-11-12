/**
 * Rental application art and icons.
 * header_building.png: the building from the top-right of the "Rental
 * Application" design (cropped, 524 x 430), left and bottom edges faded to
 * transparent so it melts into the page tint.
 */
export const applicationAssets = {
  headerBuilding: require('@/assets/images/application/header_building.png'),
  // Step 3 pet photo, cropped from the "Property Requirements & Documents"
  // design (318 x 246)
  petLabrador: require('@/assets/images/application/pet_labrador.jpg'),
};

/** Width / height of header_building.png */
export const HEADER_BUILDING_ASPECT = 524 / 430;

/**
 * Line icons (Lucide, ISC licence; white PNGs tinted in the app) at the
 * renter-set weight: scripts/icons/draw_line_icons.ps1
 * -OutDir src/assets/icons/application -Stroke 2.2 -Only user,users,mail,pencil,plus,circle_check
 * House / calendar reuse the property details set.
 */
export const applicationIcons = {
  user: require('@/assets/icons/application/user.png'),
  users: require('@/assets/icons/application/users.png'),
  mail: require('@/assets/icons/application/mail.png'),
  pencil: require('@/assets/icons/application/pencil.png'),
  plus: require('@/assets/icons/application/plus.png'),
  circleCheck: require('@/assets/icons/application/circle_check.png'),
  briefcase: require('@/assets/icons/application/briefcase.png'),
  idCard: require('@/assets/icons/application/id_card.png'),
  paw: require('@/assets/icons/application/paw.png'),
  car: require('@/assets/icons/application/car.png'),
  package: require('@/assets/icons/application/package.png'),
  upload: require('@/assets/icons/application/upload.png'),
  send: require('@/assets/icons/application/send.png'),
  locate: require('@/assets/icons/application/locate.png'),
  mapPin: require('@/assets/icons/application/map_pin.png'),
  refresh: require('@/assets/icons/application/refresh_cw.png'),
  clock: require('@/assets/icons/application/clock.png'),
  circleX: require('@/assets/icons/application/circle_x.png'),
  circleAlert: require('@/assets/icons/application/circle_alert.png'),
  funnel: require('@/assets/icons/application/funnel.png'),
  layers: require('@/assets/icons/property/layers.png'),
  coins: require('@/assets/icons/property/database.png'),
  house: require('@/assets/icons/property/house.png'),
  calendar: require('@/assets/icons/property/calendar_days.png'),
  document: require('@/assets/icons/property/note.png'),
};
