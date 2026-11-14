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
  // "Current Status" document illustration, cropped from the "Application
  // Details" design (230 x 215), edges feathered to transparent
  statusDocuments: require('@/assets/images/application/status_documents.png'),
  // "Offer Received" signed-document illustration, cropped from the "Offer
  // Acceptance" design (280 x 210), edges feathered to transparent
  offerDocument: require('@/assets/images/application/offer_document.png'),
};

/** Width / height of offer_document.png */
export const OFFER_DOCUMENT_ASPECT = 280 / 210;

/** Width / height of status_documents.png */
export const STATUS_DOCUMENTS_ASPECT = 230 / 215;

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
  // lucide file-up: "Upload Main Image" pill (Add New Property)
  fileUp: require('@/assets/icons/application/file_up.png'),
  send: require('@/assets/icons/application/send.png'),
  locate: require('@/assets/icons/application/locate.png'),
  mapPin: require('@/assets/icons/application/map_pin.png'),
  refresh: require('@/assets/icons/application/refresh_cw.png'),
  clock: require('@/assets/icons/application/clock.png'),
  circleX: require('@/assets/icons/application/circle_x.png'),
  circleAlert: require('@/assets/icons/application/circle_alert.png'),
  funnel: require('@/assets/icons/application/funnel.png'),
  // Application Details (same script, -Stroke 2.2)
  eye: require('@/assets/icons/application/eye.png'),
  handshake: require('@/assets/icons/application/handshake.png'),
  bed: require('@/assets/icons/application/bed_double.png'),
  graduationCap: require('@/assets/icons/application/graduation_cap.png'),
  fileSearch: require('@/assets/icons/application/file_search.png'),
  fileText: require('@/assets/icons/application/file_text.png'),
  signature: require('@/assets/icons/application/signature.png'),
  // Submitted Application (same script, -Stroke 2.2; share from the property set)
  download: require('@/assets/icons/application/download.png'),
  expand: require('@/assets/icons/application/expand.png'),
  fileCheck: require('@/assets/icons/application/file_check.png'),
  share: require('@/assets/icons/property/share.png'),
  // Offer Acceptance
  building: require('@/assets/icons/property/building.png'),
  // Lease Review (same script, -Stroke 2.2)
  fileSignature: require('@/assets/icons/application/file_signature.png'),
  // Payment (same script, -Stroke 2.2)
  creditCard: require('@/assets/icons/application/credit_card.png'),
  key: require('@/assets/icons/manage/key.png'),
  wallet: require('@/assets/icons/property/wallet.png'),
  layers: require('@/assets/icons/property/layers.png'),
  coins: require('@/assets/icons/property/database.png'),
  house: require('@/assets/icons/property/house.png'),
  calendar: require('@/assets/icons/property/calendar_days.png'),
  document: require('@/assets/icons/property/note.png'),
};
