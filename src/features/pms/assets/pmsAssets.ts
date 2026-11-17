/**
 * PMS home art and icons.
 * Photos are cropped from the "UrbanNest Real Estate Dashboard" design
 * (the "24 units" / "FOR RENT" pills painted out: the app draws its own):
 * hero_building.jpg (1220 x 660): the building at the right of the hero,
 * cropped wide (whole building) and upscaled 2x (bicubic + light sharpen);
 * maple_street.jpg (695 x 188) and oak_ave.jpg (278 x 188): the two
 * My Property(s) cards. The other four sample properties reuse landlord
 * building photos (the design shows only two cards).
 */
import { landlordAssets } from '@/features/landlord/assets/landlordAssets';

export const pmsAssets = {
  heroBuilding: require('@/assets/images/pms/pms_hero_building.jpg'),
  mapleStreet: require('@/assets/images/pms/pms_maple_street.jpg'),
  oakAve: require('@/assets/images/pms/pms_oak_ave.jpg'),
  pineRd: landlordAssets.regentPlaza,
  elmSt: landlordAssets.emeraldGardens,
  cedarLn: landlordAssets.oakridge,
  birchBlvd: landlordAssets.sampleDusk,
};

/** Width / height of pms_hero_building.jpg */
export const HERO_BUILDING_ASPECT = 1220 / 660;

/**
 * Line icons (Lucide, ISC licence; white PNGs tinted in the app), drawn at
 * the renter weight by scripts/icons/draw_line_icons.ps1
 * -OutDir src/assets/icons/pms -Stroke 2.2 -Only … (list in the script).
 */
export const pmsIcons = {
  alert: require('@/assets/icons/pms/alert.png'),
  arrowUp: require('@/assets/icons/pms/arrow_up.png'),
  bell: require('@/assets/icons/pms/bell.png'),
  building: require('@/assets/icons/pms/building.png'),
  calendar: require('@/assets/icons/pms/calendar.png'),
  calendarX: require('@/assets/icons/pms/calendar_x.png'),
  check: require('@/assets/icons/pms/check.png'),
  chevronRight: require('@/assets/icons/pms/chevron_right.png'),
  circleCheck: require('@/assets/icons/pms/circle_check.png'),
  circleDollar: require('@/assets/icons/pms/circle_dollar.png'),
  clock: require('@/assets/icons/pms/clock.png'),
  contact: require('@/assets/icons/pms/contact.png'),
  creditCard: require('@/assets/icons/pms/credit_card.png'),
  download: require('@/assets/icons/pms/download.png'),
  fileText: require('@/assets/icons/pms/file_text.png'),
  history: require('@/assets/icons/pms/history.png'),
  house: require('@/assets/icons/pms/house.png'),
  menu: require('@/assets/icons/pms/menu.png'),
  pieChart: require('@/assets/icons/pms/pie_chart.png'),
  receipt: require('@/assets/icons/pms/receipt.png'),
  search: require('@/assets/icons/pms/search.png'),
  trendingDown: require('@/assets/icons/pms/trending_down.png'),
  trendingUp: require('@/assets/icons/pms/trending_up.png'),
  user: require('@/assets/icons/pms/user.png'),
  userCheck: require('@/assets/icons/pms/user_check.png'),
  userPlus: require('@/assets/icons/pms/user_plus.png'),
  users: require('@/assets/icons/pms/users.png'),
  wallet: require('@/assets/icons/pms/wallet.png'),
  wrench: require('@/assets/icons/pms/wrench.png'),
};

export type PmsIconName = keyof typeof pmsIcons;
