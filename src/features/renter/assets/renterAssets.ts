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
  // Modern white apartment building with glass balconies (Unsplash
  // 1551361415-69c87624334f), cropped to 1080 x 1142
  sterling: require('@/assets/images/renter/residence_sterling.jpg'),
  azure: require('@/assets/images/renter/residence_azure.jpg'),
  marble: require('@/assets/images/renter/residence_marble.jpg'),
  // Dashboard event photo (Unsplash 1572116469696)
  eventSkyLounge: require('@/assets/images/renter/event_sky_lounge.jpg'),
  // Check-in "Curated Living" photo (Unsplash 1600210492486)
  livingCurated: require('@/assets/images/renter/living_curated.jpg'),
  // Check-in "Around Your Home" place photos (Unsplash; coaster: Wikimedia CC0)
  placeSchoolClassroom: require('@/assets/images/renter/place_school_classroom.jpg'),
  placeSchoolCampus: require('@/assets/images/renter/place_school_campus.jpg'),
  placeHospitalBuilding: require('@/assets/images/renter/place_hospital_building.jpg'),
  placeHospitalLobby: require('@/assets/images/renter/place_hospital_lobby.jpg'),
  placeParkSwing: require('@/assets/images/renter/place_park_swing.jpg'),
  placeParkCoaster: require('@/assets/images/renter/place_park_coaster.jpg'),
  // Move-in inspection hero: people in a living room (Unsplash nkUCyTz2lKU,
  // João Emanuel, 3D render; cropped to the hero's shape)
  inspectionHero: require('@/assets/images/renter/inspection_hero.jpg'),
  // Inspection area photos (Unsplash, cropped to the hero's shape):
  // living mw_mj-noYHM Zac Gudakov · dining GmIt2MvjgfQ Kailun Zhang ·
  // kitchen GliaHAJ3_5A Jason Briscoe · bedroom AT1AqItpuOI Puscas Adryan ·
  // washroom 9OKuf13OidA Peter Muniz · common 1PXsFfTbEcI Aalo Lens ·
  // outside xQWLtlQb7L0 garrett parker
  areaLiving: require('@/assets/images/renter/area_living.jpg'),
  areaDining: require('@/assets/images/renter/area_dining.jpg'),
  areaKitchen: require('@/assets/images/renter/area_kitchen.jpg'),
  areaBedroom: require('@/assets/images/renter/area_bedroom.jpg'),
  areaWashroom: require('@/assets/images/renter/area_washroom.jpg'),
  areaCommon: require('@/assets/images/renter/area_common.jpg'),
  areaOutside: require('@/assets/images/renter/area_outside.jpg'),
  // Utilities photos (cropped to 1000 x 620): electricity Unsplash
  // 1473341304170-971dccb5ac1e · water Unsplash 1548839140-29a749e1cf4d ·
  // sewer Unsplash 1513828583688-c52646db42da · gas Wikimedia Commons
  // "Flame from the burner of a gas stove" by BogTar201213, CC BY-SA 4.0
  utilityElectricity: require('@/assets/images/renter/utility_electricity.jpg'),
  utilityWater: require('@/assets/images/renter/utility_water.jpg'),
  utilityGas: require('@/assets/images/renter/utility_gas.jpg'),
  utilitySewer: require('@/assets/images/renter/utility_sewer.jpg'),
  // Provider thumbnails (300 x 300): Unsplash 1621905251918-48416bd8575a
  // (power) · 1548337138-e87d889cc369 (wind) · 1585704032915-c3400ca199e7
  // (water) · 1541888946425-d81bb19240f5 (sewer) · gas: Wikimedia Commons
  // "Gas Stove Burner Blue Flame" by Federico Cardoner, CC BY 2.0
  providerGatewayPower: require('@/assets/images/renter/provider_gateway_power.jpg'),
  providerPrairieWind: require('@/assets/images/renter/provider_prairie_wind.jpg'),
  providerCityWater: require('@/assets/images/renter/provider_city_water.jpg'),
  providerHeartlandGas: require('@/assets/images/renter/provider_heartland_gas.jpg'),
  providerLakesideSanitary: require('@/assets/images/renter/provider_lakeside_sanitary.jpg'),
  // More provider thumbnails (Unsplash): solar 1497435334941-8c899ee9e8e9 ·
  // underwater 1559825481-12a05cc00344 · bathroom 1584622650111-993a426fbf0a ·
  // plans 1581092160562-40aa08e78837 · kitchen 1556909114-f6e7ad7d3136 ·
  // rain 1501691223387-dd0500403074 · site crew 1504307651254-35680f356dfd
  providerSunfieldSolar: require('@/assets/images/renter/provider_sunfield_solar.jpg'),
  providerRiverbendWater: require('@/assets/images/renter/provider_riverbend_water.jpg'),
  providerAquaPure: require('@/assets/images/renter/provider_aquapure.jpg'),
  providerMidwestEnergy: require('@/assets/images/renter/provider_midwest_energy.jpg'),
  providerGasSafety: require('@/assets/images/renter/provider_gas_safety.jpg'),
  providerMetroDrain: require('@/assets/images/renter/provider_metro_drain.jpg'),
  providerCountyWastewater: require('@/assets/images/renter/provider_county_wastewater.jpg'),
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
  inspect: require('@/assets/icons/renter/inspect.png'),
  bolt: require('@/assets/icons/renter/bolt.png'),
  wifi: require('@/assets/icons/renter/wifi.png'),
  shield: require('@/assets/icons/renter/shield.png'),
  key: require('@/assets/icons/renter/key.png'),
  check: require('@/assets/icons/renter/check.png'),
  school: require('@/assets/icons/renter/school.png'),
  hospital: require('@/assets/icons/renter/hospital.png'),
  park: require('@/assets/icons/renter/park.png'),
  // Utilities: gas flame and sewer waves (drawn to match the set)
  flame: require('@/assets/icons/renter/flame.png'),
  waves: require('@/assets/icons/renter/waves.png'),
  // Modern line icons for the Manage shortcuts (Lucide, ISC licence),
  // drawn by scripts/icons/draw_line_icons.ps1
  lineWrench: require('@/assets/icons/manage/wrench.png'),
  lineReceipt: require('@/assets/icons/manage/receipt.png'),
  lineCalendar: require('@/assets/icons/manage/calendar.png'),
  lineDumbbell: require('@/assets/icons/manage/dumbbell.png'),
  lineKey: require('@/assets/icons/manage/key.png'),
};

/** Width / height of residences_header.jpg */
export const RENTER_HEADER_ASPECT = 1290 / 1150;
