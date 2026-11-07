# PROJECT.md — Architecture, Navigation, Config & Design System

> **Single source of truth** for the UrbanNest app *and* a reusable blueprint for the next React Native project.
> AI sessions: **read this file first** before building any screen, reuse the components/tokens below, and update the "Implemented Screens" section after adding a screen.
> To start a new project from this setup, follow **Section 12 — Bootstrap a New Project**.

---

## 1. Project Overview & Tech Stack

**UrbanNest** is a high-end real estate operations / property management command center (showings, inspections, calendar capacity, tours) for portfolio directors, dispatchers and agents.

| Area | Choice | Version |
| :--- | :--- | :--- |
| Framework | React Native (New Architecture / Fabric) | `0.88.1` |
| UI runtime | React | `19.3.0` |
| Language | TypeScript (strict) | `^6.0.3` |
| Navigation | `@react-navigation/native` + `native-stack` | `^6.1.18` / `^6.10.1` |
| Native deps for nav | `react-native-screens`, `react-native-safe-area-context` | `^4.30.1` / `^5.5.2` |
| State | Redux Toolkit + React Redux | `^2.2.0` / `^9.1.0` |
| HTTP | Axios | `^1.7.0` |
| Path alias | `babel-plugin-module-resolver` (`@/` → `src/`) | `^5.0.2` |
| Testing | Jest + `@react-native/jest-preset` + `react-test-renderer` | `29.x` / `19.3.0` |
| Lint / format | `@react-native/eslint-config`, Prettier | eslint `^8.19`, prettier `2.8.8` |
| CLI | `@react-native-community/cli` | `20.2.0` |
| Node | engines | `>= 22.11.0` |

**Deliberately NOT used** (avoids native-linking issues): `react-native-vector-icons`, `react-native-linear-gradient`, `react-native-svg`, Reanimated. Icons and gradients are pure RN Views (see Section 9).

### npm scripts
| Script | Command |
| :--- | :--- |
| `npm start` | `react-native start --reset-cache` |
| `npm run android` | `react-native run-android` |
| `npm run ios` | `react-native run-ios` |
| `npm test` | `jest` |
| `npm run lint` | `eslint .` |
| Type check | `npx tsc --noEmit` |
| Link fonts after adding | `npx react-native-asset` |

---

## 2. Folder Architecture

Feature-based modular architecture. Shared code lives in top-level `src/` folders; anything specific to one domain lives in `src/features/<feature>/`.

```
UrbanNestMobile/
├── index.js                     # AppRegistry.registerComponent(appName, () => App)
├── App.tsx                      # Re-exports src/app/App (keeps RN template entry intact)
├── app.json                     # { name, displayName }
├── babel.config.js              # RN preset + module-resolver alias '@' -> ./src
├── metro.config.js              # extraNodeModules '@' -> src
├── tsconfig.json                # extends @react-native/typescript-config, paths '@/*'
├── react-native.config.js       # assets: ['./src/assets/fonts'] (font linking)
├── jest.config.js / jest.setup.js
├── .eslintrc.js / .prettierrc.js / .watchmanconfig / Gemfile
├── __tests__/                   # App, Splash, Home, Calendar screen tests
├── android/  ios/               # Native projects
├── scratch/                     # Local helper scripts (not app code)
└── src/
    ├── app/
    │   ├── App.tsx              # <AppProviders><RootNavigator/></AppProviders>
    │   └── providers/index.tsx  # Redux Provider + SafeAreaProvider + StatusBar
    ├── assets/
    │   ├── fonts/               # Inter-*, PlayfairDisplay-*, Poppins-* (Poppins deprecated)
    │   ├── icons/
    │   └── images/              # property photos, splash art, logo, calendar header
    ├── components/              # Global UI primitives (barrel: index.ts)
    │   ├── Button.tsx  Card.tsx  Input.tsx  LoadingIndicator.tsx
    │   ├── LinearGradient.tsx   # pure-RN gradient
    │   └── icons/index.tsx      # pure-RN icon set
    ├── config/
    │   ├── env.ts               # AppConfig (apiBaseUrl, timeout, logging, apiVersion)
    │   ├── theme.ts             # colors, gradients, spacing, radii, typography, shadows, commonStyles
    │   └── index.ts
    ├── features/
    │   ├── index.ts             # re-exports every feature
    │   ├── auth/                # MVVM reference feature
    │   │   ├── types.ts         # Model contracts + discriminated-union state
    │   │   ├── slice.ts         # Redux slice (Model state)
    │   │   ├── api.ts           # API calls (mock fallback, apiClient ready)
    │   │   ├── hooks/useAuth.ts # ViewModel
    │   │   ├── screens/LoginScreen.tsx  # View
    │   │   └── index.ts
    │   ├── home/      { components/, screens/HomeScreen.tsx, index.ts }
    │   ├── calendar/  { components/, screens/CalendarScreen.tsx, index.ts }
    │   ├── guest/     { assets/, components/, hooks/, screens/GuestHomeScreen.tsx, constants.ts, types.ts, index.ts }
    │   ├── persona/   { assets/, components/, hooks/, screens/PersonaSelectScreen.tsx, index.ts }
    │   ├── renter/    { assets/, components/, hooks/, screens/RenterHomeScreen.tsx, constants.ts, types.ts, index.ts }
    │   └── splash/    { assets/, components/, screens/SplashScreen.tsx, index.ts }
    ├── hooks/                   # useAppTheme, useDebounce, useKeyboard
    ├── navigation/
    │   ├── RootNavigator.tsx    # NavigationContainer + native stack
    │   ├── navigationRef.ts     # global ref + navigate()/goBack() helpers
    │   ├── types.ts             # re-exports param lists
    │   └── index.ts
    ├── services/
    │   ├── api/client.ts        # Axios instance + interceptors
    │   ├── api/endpoints.ts     # ENDPOINTS constants
    │   ├── api/types.ts         # AppApiError
    │   ├── storage/tokenStorage.ts
    │   └── index.ts
    ├── store/
    │   ├── index.ts             # configureStore, AppDispatch, RootState
    │   ├── rootReducer.ts       # combineReducers({ auth })
    │   └── hooks.ts             # useAppDispatch / useAppSelector
    ├── types/                   # api.ts, navigation.ts (param lists), index.ts
    └── utils/                   # responsive.ts, formatters.ts, validators.ts
```

### Conventions
- **Feature layout**: `src/features/<name>/{ components/, screens/, hooks/, assets/, api.ts, slice.ts, types.ts, index.ts }` — create only what the feature needs.
- **Barrel exports**: every folder has an `index.ts`; features export screens/components publicly and are re-exported from `src/features/index.ts`.
- **Imports**: use the `@/` alias for cross-folder imports (`@/config/theme`, `@/features/home`); relative paths only inside a feature.
- **File names**: `PascalCase.tsx` for components/screens, `camelCase.ts` for hooks/utils/services.
- **MVVM (auth is the reference)**: `types.ts` + `slice.ts` + `api.ts` = Model, `hooks/useX.ts` = ViewModel (business logic, formatting), `screens/` = dumb View.
- **Local images**: `require('@/assets/images/x.png')` collected in a feature `assets/*.ts` file (see `splash/assets/splashAssets.ts`, `guest/assets/guestAssets.ts`). No base64 for large images.
- **Always give bundled images explicit pixel `width` + `height`** (compute from `useWindowDimensions()` and the image's aspect ratio). `width: '100%'`, `aspectRatio` or `StyleSheet.absoluteFill` alone make a `require()`d image render at its file size (zoomed / overflowing).

---

## 3. App Boot Flow

```
index.js
  └─ AppRegistry.registerComponent('UrbanNestMobile', App)      (name from app.json)
       └─ ./App.tsx  →  export { default } from './src/app/App'
            └─ <AppProviders>                          src/app/providers/index.tsx
                 ├─ <Provider store={store}>           Redux
                 ├─ <SafeAreaProvider>
                 ├─ <StatusBar barStyle by color scheme>
                 └─ <RootNavigator/>                   src/navigation/RootNavigator.tsx
```
Add any new global provider (theme context, query client, toast host, etc.) inside `AppProviders`.

---

## 4. Navigation Structure

**Type**: one flat **Native Stack** (`createNativeStackNavigator`) inside a single `NavigationContainer` wired to a global `navigationRef`. There is no tab navigator — the bottom bar is a custom component (`BottomNavBar`) that calls `navigate()`.

### Stack config (`src/navigation/RootNavigator.tsx`)
| Route | Component | Options |
| :--- | :--- | :--- |
| `Splash` (initial) | `SplashScreen` (`@/features/splash`) | `gestureEnabled: false`, `animation: 'none'` |
| `GuestHome` | `GuestHomeScreen` (`@/features/guest`) | `gestureEnabled: false` |
| `PersonaSelect` | `PersonaSelectScreen` (`@/features/persona`) | `gestureEnabled: false` |
| `RenterHome` | `RenterHomeScreen` (`@/features/renter`) | `animation: 'slide_from_right'` |
| `ResidenceDashboard` | `ResidenceDashboardScreen` (`@/features/renter`), params `{ residenceId }` | `animation: 'slide_from_right'` |
| `CheckIn` | `CheckInScreen` (`@/features/renter`), params `{ residenceId }` | `animation: 'slide_from_right'` |
| `Home` | `HomeScreen` (`@/features/home`) | stack default |
| `Calendar` | `CalendarScreen` (`@/features/calendar`) | `animation: 'slide_from_right'` |
| `Login` | `LoginScreen` (`@/features/auth/screens/LoginScreen`) | stack default |

Global `screenOptions`: `{ headerShown: false, animation: 'fade' }` — every screen draws its own header.

### Param lists (`src/types/navigation.ts`, re-exported by `src/navigation/types.ts`)
```ts
export type RootStackParamList = {
  Splash: undefined; GuestHome: undefined; PersonaSelect: undefined; RenterHome: undefined; ResidenceDashboard: { residenceId: string }; CheckIn: { residenceId: string }; Auth: undefined; Main: undefined;
  Home: undefined; Calendar: undefined; Login: undefined;
};
export type AuthStackParamList = { Login: undefined; Register: undefined; ForgotPassword: { email?: string } | undefined };
export type MainStackParamList = { Home: undefined; Calendar: undefined; Profile: { userId: string }; Settings: undefined };
```
`AuthStackParamList` / `MainStackParamList` and the `Auth` / `Main` routes are **reserved for a future split** (Auth stack vs Main stack) and are not mounted yet.

### Global navigation helpers (`src/navigation/navigationRef.ts`)
- `navigationRef = createNavigationContainerRef<RootStackParamList>()`
- `navigate(screen, params?)` — type-safe, no-op until the container is ready; usable outside React (services, middleware, interceptors).
- `goBack()` — only runs if `canGoBack()`.

### How screens navigate (current pattern)
Screens take an optional `navigation` prop and fall back to the global helper:
```ts
const handleNavigate = (route: keyof RootStackParamList) => {
  if (propNavigation?.navigate) propNavigation.navigate(route);
  else navigate(route);
};
```
Child components (`ScheduleSection`, `QuickActionBar`, `BottomNavBar`, …) only receive callbacks (`onViewCalendar`, `onTabPress`) — they never import navigation directly.

### Current flow
- **Splash → GuestHome** (`replace`): when the splash video ends, or tap anywhere.
- **GuestHome → PersonaSelect** (`navigate`): "Log In / Sign Up" pill in the hero.
- **PersonaSelect → RenterHome** (`replace`): "Continue as Renter".
- **RenterHome → CheckIn** (`navigate`): tap a Move-In Ready card ("Check-In Now").
- **RenterHome → ResidenceDashboard** (`navigate`): tap a current residence card (active lease) (past leases show "coming soon"). Back button / system back returns.
- **PersonaSelect → Home** (`replace`): "Continue as PMS". The route for each persona is in `ROUTE_FOR_PERSONA` (`usePersonaSelection`).
- **Home → Calendar**: "View Calendar" (ScheduleSection), "Schedule" (QuickActionBar), CALENDAR tab (BottomNavBar).
- **Calendar → Home**: HOME tab in BottomNavBar or system back.
- **Login**: registered but not reachable from the UI yet.

### Adding a new screen (checklist)
1. Create `src/features/<name>/screens/<Name>Screen.tsx` (+ `components/`, `index.ts`).
2. Export it from the feature `index.ts` and from `src/features/index.ts`.
3. Add the route + params to `RootStackParamList` in `src/types/navigation.ts`.
4. Register `<Stack.Screen name="<Name>" component={<Name>Screen} />` in `RootNavigator.tsx`.
5. Navigate with `navigate('<Name>')` or the `navigation` prop; wire `BottomNavBar` if it is a tab.
6. Add a test in `__tests__/<Name>Screen.test.tsx`.

---

## 5. State Management (Redux Toolkit)

- `src/store/index.ts`: `configureStore({ reducer: rootReducer, middleware: defaults with serializableCheck, devTools: __DEV__ })`; exports `store`, `AppStore`, `AppDispatch`, `RootState`, and the typed hooks.
- `src/store/rootReducer.ts`: `combineReducers({ auth: authReducer })` — register new feature reducers here.
- `src/store/hooks.ts`: `useAppDispatch`, `useAppSelector` — **always use these**, never raw `useDispatch` / `useSelector`.
- **State shape pattern**: discriminated unions (e.g. `AuthState` = `idle | loading | authenticated | unauthenticated | error`) so invalid combinations are impossible; reducers return whole new state objects.
- Async logic lives in the feature ViewModel hook (`useAuth`): dispatch `pending` → call `api` → dispatch `success` / `failure`, persist tokens via `tokenStorage`.

### Adding a slice
1. `src/features/<name>/types.ts` (state union) → `slice.ts` (`createSlice`, export actions + reducer).
2. Register it in `rootReducer.ts`.
3. Consume it through a `hooks/use<Name>.ts` ViewModel.

---

## 6. Services, API & Environment

- **Env** (`src/config/env.ts`): `config = { appName, env, apiBaseUrl, apiTimeout: 15000, enableLogging: __DEV__, apiVersion: 'v1' }`. Dev → `https://api.dev.UrbanNestMobile.com`, prod → `https://api.UrbanNestMobile.com` (switched by `__DEV__`; no `.env` library).
- **API client** (`src/services/api/client.ts`): `createApiClient()` → Axios instance with JSON headers, base URL, timeout.
  - Request interceptor: attaches `Authorization: Bearer <token>` from `tokenStorage`; logs in dev.
  - Response interceptor: logs, normalizes every error into `AppApiError(message, code, status, details)`; on `401` clears tokens.
- **Endpoints** (`src/services/api/endpoints.ts`): `ENDPOINTS.AUTH.{LOGIN, LOGOUT, REFRESH, ME}`, `ENDPOINTS.USER.{PROFILE, UPDATE}`.
- **Token storage** (`src/services/storage/tokenStorage.ts`): class with async `get/setAccessToken`, `get/setRefreshToken`, `clear` — **in-memory only** for now; swap the internals for Keychain / EncryptedStorage without changing callers.
- **Feature API files** (`features/<x>/api.ts`) call `apiClient` with `ENDPOINTS`; auth currently uses a mock with an 800ms delay (`password === 'error123'` simulates a failure).

---

## 7. Configuration Files (copy these into a new project)

**babel.config.js**
```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [['module-resolver', {
    root: ['./src'],
    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
    alias: { '@': './src' },
  }]],
};
```

**tsconfig.json**
```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "strict": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["**/node_modules", "**/Pods"]
}
```

**metro.config.js**
```js
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const config = { resolver: { extraNodeModules: { '@': path.resolve(__dirname, 'src') } } };
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

**react-native.config.js** (font linking — run `npx react-native-asset` after adding fonts)
```js
module.exports = { project: { ios: {}, android: {} }, assets: ['./src/assets/fonts'] };
```

**jest.config.js** + **jest.setup.js**
```js
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-redux|immer)/)',
  ],
};
// jest.setup.js
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
```

- **.prettierrc.js**: `{ arrowParens: 'avoid', singleQuote: true, trailingComma: 'all' }`
- **.eslintrc.js**: `{ root: true, extends: '@react-native' }`
- **Root App.tsx**: `export { default } from './src/app/App';`
- **index.js**: `AppRegistry.registerComponent(appName, () => App);`

---

## 8. Design System Specifications

### 1. Color Palette & Hex Codes
Defined in `src/config/theme.ts`:

| Token | Hex Value | Purpose / Usage |
| :--- | :--- | :--- |
| `primary` | `#2563EB` | Primary brand accent blue, selected day circles, active tabs, action links |
| `headerDarkBlue` | `#0B1D3A` | Dark navy top navigation header background, agent avatar circle |
| `headerGradientStart` | `#032B57` | Deep navy start color for linear gradients |
| `headerGradientEnd` | `#518EF9` | Vibrant periwinkle end color for header gradient |
| `buttonGradientStart` | `#032B57` (theme) / `#03264C` (gradients.button) | Start gradient for high-priority CTA buttons |
| `buttonGradientEnd` | `#0659B2` | End gradient for high-priority CTA buttons |
| `secondary` | `#64748B` | Slate gray for secondary subtitles, icons, meta details |
| `accent` / `warning` | `#F59E0B` | Amber/orange for calendar status dots, inspections segment |
| `warningLight` | `#FEF3C7` | Light yellow/gold background for `"82% BOOKED"` badge & awaiting tags |
| `warningDark` | `#B45309` | Text color inside warning/booked badges |
| `success` | `#10B981` | Green status indicators, live operational dot |
| `successDark` | `#15803D` / `#16A34A` | Occupancy text, `"3 Left"` capacity counter |
| `successLight` | `#DCFCE7` | Occupancy badge background |
| `error` | `#EF4444` | Red notification badges, `"Cancel Tour"` border & text |
| `errorLight` | `#FEE2E2` / `#FECDD3` | Light red border for cancellation actions |
| `background` | `#F8FAFC` | Base light neutral app background |
| `surface` | `#FFFFFF` | Card surface and sheet backgrounds |
| `border` | `#E2E8F0` | Default card and button border stroke |
| `borderLight` | `#F1F5F9` | Inner dividers, segmented switcher backgrounds |
| `textPrimary` | `#1E293B` / `#0F172A` | Core dark title and heading text |
| `textSecondary` | `#64748B` | Secondary label text |
| `textMuted` | `#94A3B8` | Subtle dates, day headers, inactive tab colors |
| `subtitlePeriwinkle` | `#C7D2FE` | Muted subtitle text on dark navy headers |

**Guest home tokens (finalized):**

| Token | Value | Purpose / Usage |
| :--- | :--- | :--- |
| `pageTint` | `#EEF3F9` | Light blue-gray page background of the guest home |
| `navy` | `#0B2A5B` | Active tab pill, Premium badge, dark button text, category icons |
| `tileBlue` | `#DCE6F4` | Category icon tile background |
| `chipBlue` | `#DCE8FB` | "See More Properties" pill background |
| `heroAccent` | `#FAD24D` | Gold italic "Simple" in the hero headline |
| `heroAccentUnderline` | `rgba(250, 210, 77, 0.4)` | 3px bar under "Simple" |
| `gold` | `#F5B83D` | Star in Exclusive / Premium badges, badge border |
| `goldBadgeBg` | `rgba(58, 40, 6, 0.85)` | "Exclusive" badge background |
| `favorite` | `#EF4444` | Filled favorite heart |

### 2. Linear Gradients
Managed via `src/components/LinearGradient.tsx`:
- **Header Gradient**: `#032B57` → `#518EF9` (Greeting top banner)
- **Button Gradient**: `#03264C` → `#0659B2` (CTA buttons: `"EVENT"`, `"Confirm"`, `"Open Showing Pack"`)
- **Selected Card Gradient**: `#4075E9` → `#94B0EA` (Light blue horizontal gradient for active event card in Calendar Week view)
- **Image Dark Scrim Overlay**: `transparent` → `rgba(0, 0, 0, 0.8)` (Property photo text readability)

### 3. Typography & Fonts
The application strictly uses **2 font families** (Poppins was deprecated and removed):
1. **Playfair Display** (`typography.fontFamily.heading`):
   - `PlayfairDisplay-Regular`: Used for `"NEYORA"` monogram, greeting headline `"Good morning,\nAlex"`.
   - `PlayfairDisplay-Medium` / `SemiBold`: Section titles (`"Calendar"`, `"Needs Your Attention"`, `"Today's Schedule"`, `"Property Activity"`, `"Unit 402 – 2BR Luxury View"`).
   - `PlayfairDisplay-Bold`: Signature splash screen brand title `"UrbanNest"`.
2. **Inter** (`typography.fontFamily.body`):
   - `Inter-Regular`: Body text, dates, addresses, subtitles, descriptions, splash tagline `"Mange your time ,effortlessly"`.
   - `Inter-Medium`: Links (`"View All"`, `"View Calendar"`), badges (`"LIVE"`, `"82% BOOKED"`), segment tabs, inactive bottom tabs.
   - `Inter-SemiBold` / `Bold`: Card titles, prospect names (`"Marcus Reed"`), button text, price labels, active bottom tabs.

**Finalized text presets** (`typographyPresets` in `theme.ts`; sizes go through `scaleFont`, exact at 390pt width):

| Preset | Font | Weight | Size / Line height | Extra | Used for |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `heroTitle` | Playfair Display | 800 ExtraBold in Figma → **Bold (700) until `PlayfairDisplay-ExtraBold.ttf` is added** | 30 / 35.4 | letterSpacing -0.75, white | **The one page-headline style for the whole app**: "Finding New Home is *Simple*" (guest hero), "Choose your persona", renter hero / header / check-in status titles |
| `heroAccent` | Playfair Display | 600 SemiBold | 30 / 35.4 | letterSpacing -0.75, `heroAccent` gold | Accent word inside a `heroTitle` line ("*Simple*"); slant with `transform: [{ skewX: "-10deg" }]` |
| `displayTitle` | Playfair Display | 600 SemiBold | 18 / 24.75 | letterSpacing 0, center | Centered section titles ("Most Exclusive Homes Just For You") |
| `sectionDescription` | Inter | 400 Regular | 10 / 17.88 | letterSpacing 0, center, `textSecondary` | Paragraph under a centered section title |
| `sectionHeading` | Playfair Display | 500 Medium | 19 / 26 | — | Left-aligned section titles ("Rentals Near You", "Resources & Guides") |
| `eyebrow` | Inter | 500 Medium | 11 / 14 | uppercase, letterSpacing 1.4, `textMuted` | "FEATURED PROPERTIES", "TOP CITIES" |
| `price` | Inter | 700 Bold | 16 / 22 | — | Listing prices |
| `caption` | Inter | 400 Regular | 10.5 / 14 | `textMuted` | Meta text ("Renters • 4 min read", stats) |
| `brandTitle` | Playfair Display | 700 Bold | 21 | white | Logo text in page headers (pass as `BrandLockup` `textStyle`) |
| `heroSubtitle` | Inter | 400 Regular | 12 / 18 (`fontSize.sm` / `lineHeight.sm`) | white 88% | Paragraph under `heroTitle` on a dark header |
| `listingTitle` | Inter | 600 SemiBold | 15 / 20 | `navy` | Property name on listing / residence cards |
| `premiumBadge` | Inter | 500 Medium | 9 | white | "Premium" text; container is `commonStyles.premiumBadge` (navy pill) + gold `StarGlyph` |

All presets above (plus `cardTitle`, `cardSubtitle`, `body*`, `label`, `badge`, `button`, `tabLabel` in `theme.ts`) are the **only** text styles screens may use. Apply them directly, e.g. `style={[typographyPresets.listingTitle, styles.name]}`, where the local style holds layout only.

Hero accent word "Simple": `heroAccent` preset (Playfair SemiBold, gold) slanted with `transform: [{ skewX: '-10deg' }]`, with the `heroAccentUnderline` bar.

**Playfair rules (apply app-wide):**
- Page headlines always use `heroTitle` (+ `heroAccent` for a highlighted word); section titles use `sectionHeading` / `displayTitle`; logo text uses `brandTitle`. Don't hand-roll Playfair styles in screens.
- Never add `fontWeight` to a Playfair style: the weight is in the font file (`PlayfairDisplay-Bold` etc.). Extra `fontWeight` can make Android fake-bold or fall back to the system font. The Playfair presets in `theme.ts` carry no `fontWeight`.
- Never use `fontStyle: 'italic'` with Playfair: there is no italic file, so Android may render the system font. Use `skewX` for a slanted look.

### 4. Spacing Conventions
- **`spacing.screenHorizontal`**: `20dp` standard side padding on all screens.
- **`spacing.section`**: `24dp` (`moderateScale(24)`) standard vertical distance between stacked cards (dashboard screens).
- **`spacing.sectionGap`**: `40dp` (`moderateScale(40)`) — **finalized vertical gap between page sections** on the guest home (search card → categories → featured → rentals → guides → cities → trust bar).
- **Guides section**: `20dp` (`spacing.xl`) everywhere — large card ↔ small cards, between the two small cards, and the text/arrow inset inside the large card.
- **Card inner padding**: `moderateScale(16)`.
- **Inner elements gap**: `moderateScale(10)` to `moderateScale(12)`.

### 5. Border Radii & Shadows
- **Card border radius**: `moderateScale(16)` to `moderateScale(20)`.
- **Button border radius**: `moderateScale(10)` to `moderateScale(12)`.
- **Badge / Pill radius**: `moderateScale(10)` or `9999` (full pill).
- **Shadows**: Pure platform-friendly shadow definitions in `shadows.sm`, `shadows.md`.

---

## 9. Reusable UI Architecture

### 1. Responsive Scaling Helpers (`src/utils/responsive.ts`)
- `moderateScale(size, factor = 0.5)`: Scale padding, margins, card widths, icon sizes proportionally to device dimensions.
- `scaleFont(fontSize, maxScaleFactor = 1.3)`: Responsive font scaler with accessibility clamping.
- `wp(percentage)` / `hp(percentage)`: Viewport width and height helpers.

### 2. Pure React Native Vector Icons (`src/components/icons/index.tsx`)
Crisp, anti-aliased icon components using pure React Native Views or base64 assets to prevent native binary linking bugs:
- Core icons: `SearchIcon`, `BellIcon`, `CalendarIcon`, `BookmarkIcon`, `ChatTabIcon`, `SettingsIcon`, `ChevronDownIcon`, `ChevronRightIcon`, `ChevronLeftIcon`, `PlusIcon`, `UploadIcon`, `BriefcaseIcon`, `RefreshIcon`, `EditIcon`, `MoreVerticalIcon`, `CloseIcon`, `ClockIcon`, `CheckmarkIcon`, `MapPinIcon`, `MessageBubbleIcon`.

### 2b. Brand Logo (`src/components/BrandLogo.tsx`)
- `<BrandLogo size={ms(26)} />`: full-colour Urban Nest house mark (blue ribbon house, ice-blue → royal-blue gradient, folded right leg). Never tint it. The PNG has no padding (house touches every edge).
- `<BrandLockup label logoSize gap textStyle />`: logo + wordmark with the house's flat bottom sitting on the text **baseline** (row `flex-end`; logo `marginBottom` = measured descender from `onTextLayout`). Used in the Guest Home header (`HeroSection`, logo 24) and the My Residences header (`RenterHeader`, logo 20). Don't centre the logo against the text.
- PNG: `src/assets/images/brand/urban_nest_logo.png` (480 × 464, transparent), redrawn as vectors by `scripts/brand/draw_logo.ps1` from the user's reference; re-run that script (e.g. `-Scale 4`) for a bigger export.

### 3. Bottom Navigation Bar (`src/features/home/components/BottomNavBar.tsx`)
Supports two operational modes:
- **`variant="home"`**: Displays `HOME` (active), `CALENDAR` (with status dot), `BOOKINGS` (badge 4), `MESSAGES` (badge 2).
- **`variant="calendar"`**: Displays `CALENDAR` (active with status dot), `BOOKINGS` (badge 4), `MESSAGES` (badge 2), `SETTINGS`.

---

## 10. Implemented Screens

### 0a. Guest Home (`src/features/guest/screens/GuestHomeScreen.tsx`)
- **Role**: First screen after the splash; visitors browse before signing in.
- **Sections** (top → bottom, `spacing.sectionGap` 40dp apart, page bg `pageTint`):
  1. `HeroSection`: design hero image (`hero_bg.png`, baked text painted out) shown uncropped at `width / (1560/1620)`; bottom `Scrim` fade to `pageTint`. Header: logo + "Urban Nest" (Playfair Bold 21) and a frosted round **burger menu** button (same spot the Log In pill used to be). The burger opens a white dropdown (Modal, tap outside to close) with **"Log In / Sign Up"** → PersonaSelect. The header search icon and the hero subtitle are commented out. `heroTitle` + `heroAccent` headline ("Finding New Home is *Simple*"), white "Explore Homes →" button (scrolls to the search card), page dots.
  2. `SearchCard` (overlaps hero by 28dp): frosted light-blue card (`CARD_BG`: base `#EEF4FF`, `chipBlue` wash, `#518EF9` waves bottom-right, white glossy border). Header "Find your next home" / "Search with filters or ask Orbitl AI" + two buttons:
     - **Orbitl AI** (`OrbitlOrb`, 54): emblem sphere (`orbitl_sphere.png`) with cyan/violet glow, violet ripples and 3 orbiting rings with glowing dots (`OrbitlOrb.tsx`). Opens a bubble explaining voice search; "Tap to talk" opens `OrbitlListeningOverlay` (full-screen navy, big orb, "I'm listening…", voice bars, example phrases, stop button; UI only, speech-to-text TODO).
     - **Search** (white round button): opens the filters; icon spins into the sliders icon while open. Panel = Rent | Buy segmented switch (Agents commented out), 2×2 fields and a gradient search button. Rent → "Rent / Month", "Rental Type", **Search Rentals**; Buy → "Price", "Property Type", **Search Homes for Sale** (`BUY_FILTERS`).
     - One panel open at a time; both expand / collapse smoothly via `Collapsible.tsx` (height + fade + slide).
  3. `CategoryRow`: 5 `tileBlue` icon tiles.
  4. Featured: `CenteredHeader` (`eyebrow` / `displayTitle` / `sectionDescription`) + `FeaturedCarousel` (snap, side cards scale 0.86 + fade 0.55, "Exclusive" gold badge, favorite heart).
  5. Rentals Near You: `SectionHeader` + 3 `RentalCard`s (image 448:384, "★ Premium" navy badge unless `badgeInImage`) + "See More Properties" `chipBlue` pill.
  6. `GuidesSection`: large card (1432:806) + two thumbs (696:338), 20dp spacing.
  7. `CitiesSection`: horizontal city tiles (100×116).
  8. `TrustBar`: Verified / Secure / Support.
- **Logic**: `useGuestHome` (tab mode, favorites, Log In → PersonaSelect). Data in `guest/constants.ts`; images in `src/assets/images/guest/` via `guestAssets.ts`. View-drawn icons in `guest/components/GuestIcons.tsx`.

### 0b. Persona Select (`src/features/persona/screens/PersonaSelectScreen.tsx`)
- **Role**: Opened from "Log In / Sign Up" on the guest home; pick Renter, Landlord or Property Manager (or Add Persona).
- **Pieces**: blurred photo backdrop that cross-fades with the centered card, `PersonaCarousel` (snapping cards that scale, drop and fade, with photo parallax), `PaginationDots` (sliding pill in a frosted capsule), and one white "Continue as …" button the same width as the cards. Fades use `Scrim` (stretched `fade.png`, no banding).
- **Logic**: `usePersonaSelection` (ViewModel); data in `persona/constants.ts`; photos in `src/assets/images/personas/` (Unsplash).

### 0c. Renter Home — My Residences (`src/features/renter/screens/RenterHomeScreen.tsx`)
- **Role**: Landing page after choosing the Renter persona. Built from the "Urban Nest Residences Dashboard" design in the app theme.
- **Pieces** (top → bottom, page bg `pageTint`):
  0. Header art `residences_header.jpg` (1290×1150: the design’s dusk-house image `012.png`, fitted to width; bottom fades navy → light blue → `pageTint` with stops sampled from the mockup, so the filter bar sits on the pale band), absolutely positioned at `width × width/1.12`.
  1. `RenterHeader`: house icon + "URBAN NEST", initials avatar, "MY RENTALS" eyebrow, "My Residences" (`heroTitle`, 30), two-line subtitle. Logo text and subtitle match the guest hero.
  2. `ResidenceFilterBar`: frosted white track — All Rentals / Active / Past with count bubbles (fixed widths 1.3 : 1 : 1). One glass pill (solid `navy` + smooth white `Scrim` sheen from the top + light hairline rim) springs between segments (`Animated.spring`, JS driver since it animates left/width); labels and badges cross-fade navy ↔ white as it passes.
  3. `ResidenceCard`s (24dp apart): fully rounded photo (same height on every card: width × 0.46, `RESIDENCE_IMAGE_RATIO`) with dark status pill (green / grey dot) and frosted "…" menu; `listingTitle` navy name + navy "Premium" badge (same as the guest rental card); navy pin + `cardSubtitle` address; footer: calendar/clock icon circles with label + bold value (divider between two facts) and action (footer wraps, so dates never truncate; the action drops to its own line, right-aligned, when space is short) — gradient "Check-In Now", `pageTint` "Manage", text link "Details" + small `ArrowCircleIcon`.
  4. `RenterTabBar`: floating frosted capsule bar — Homes / Search / Alerts (dot) / Profile, icon above label. Same glass capsule as the filter (navy + white `Scrim` sheen + rim) springs between tabs; icons/labels cross-fade navy ↔ white. Tabs without a page slide over, show "coming soon", and glide back to Homes on close.
- **Logic**: `useRenterHome` (filter, tab, counts, card + menu actions — "coming soon" alerts for now). Mock data in `renter/constants.ts`; photos in `src/assets/images/renter/` (cropped from the design) via `renterAssets.ts`. Cards fade up in sequence (off in tests).

### 0d. Residence Dashboard (`src/features/renter/screens/ResidenceDashboardScreen.tsx`)
- **Role**: Detail page of the residence picked on My Residences (route param `residenceId`). Sections follow the "Urban Nest Residence Dashboard" design; the top is a distinct immersive property layout (not the navy header used elsewhere).
- **Pieces** (page bg `pageTint`):
  0. `ResidenceHero`: full-bleed photo of that residence (width × 1.08) with parallax (half-speed drift, stretch on pull-down), top + bottom navy `Scrim`s; gold "WELCOME HOME, ALEX" eyebrow, Playfair 34 name, gold pin + street/city, glass pills "• Your Residence" + lease status. Title block fades/drifts up on scroll.
  1. `DetailTopBar` (floating): glass back button + avatar; a navy bar with the residence name fades in once the photo scrolls away.
  2. Content sheet (`pageTint`, top radius 30) overlaps the photo by 30; starts with `LeaseSummaryCard` — Monthly Rent / Renewal / Your Unit with `tileBlue` icon circles.
  3. `DashboardSection` (Playfair Bold 22 navy title, subtitle, "Explore All →" in the `sectionLink` preset — theme blue) wraps each block below.
  4. `ConciergeGrid`: 2-column grid of white cards (radius 20) — soft-tinted rounded-square icon with its own accent (Maintenance amber, Invoices blue, Amenities green, Documents violet, Lease navy; from theme status/avatar palettes), small arrow chip top-right, left-aligned label + hint. Chip uses `ArrowUpRightIcon` (↗). 6th card "All Services" in `chipBlue` with navy arrow chip.
  5. `FinancialCard`: `gradients.button` panel (Rental Amount Due, "Due in 3 Days" chip, white Pay Now pill, faint skyline towers) + white HOA row (`tileBlue` bank tile, amount, "Scheduled" chip, `chipBlue` View Details pill).
  6. `RequestCard`: `tileBlue` faucet tile (navy icon), category / title / ticket meta, status pill (In Progress = warning tones).
  7. `EventCard`: photo with white "★ Featured Event" pill, Playfair title + `tileBlue` date box, description, overlapping initials avatars + "+12", primary gradient View Details.
  8. No bottom tab bar (pushed detail page; back button / system back to leave).
- **Logic**: `useResidenceDashboard(residenceId, navigation)`; scroll is an `Animated.ScrollView` with a native-driver `scrollY` shared by hero + top bar; mock data in `renter/constants.ts` (`CONCIERGE_SERVICES`, `FINANCIAL_SUMMARY`, `RECENT_REQUESTS`, `FEATURED_EVENT`). Actions show "coming soon" for now.
- **Arrows**: `ArrowRightIcon` (app-wide, in `guest/components/GuestIcons.tsx`) and `ArrowUpRightIcon` are tinted rounded-stroke PNGs in `src/assets/icons/common/` — use these for every arrow.
- **Assets**: hero uses the residence card photo; `event_sky_lounge.jpg` (Unsplash 1572116469696, cropped to avoid a bar's signage); line icons drawn as white PNGs in `src/assets/icons/renter/` (`renterIcons`, tinted via `RenterIcon`).
- **Colours**: only existing theme tokens (`navy`, `tileBlue`, `chipBlue`, `primary`, `gradients.button`, warning/success tones for status). Button rules: primary = `gradients.button` + white text; secondary = `chipBlue` + navy text; on dark panels = white + navy text; links = `sectionLink` (blue) or navy text + arrow.
- **Shared renter pieces**: `Reveal` (fade-up), `useRenterTabs` (tab state + coming-soon slide-back), `RenterTabBar`.


### 0e. Check-In (`src/features/renter/screens/CheckInScreen.tsx`)
- **Opened by**: "Check-In Now" on a Move-In Ready residence card (route `CheckIn`, param `residenceId`). Same shell as the dashboard: `ResidenceHero` (eyebrow "Almost home, Alex", pills "• Move-In Ready" + unit), `DetailTopBar` (title "Check-In"), rounded `pageTint` sheet, no tab bar.
- **Pieces** (`components/checkin/`):
  1. `CheckInStatusCard`: `gradients.button` panel with faint light rings, gold "CURRENT STATUS" eyebrow, white "Verified" chip, `heroTitle` "Move-In Ready", note, glass facts strip (Lease ID | Move-In date), white "Access Digital Key" pill (navy key circle + key window hint).
  2. `CheckInChecklist` (in `DashboardSection` "Move-In Checklist"): ONE white card holding progress ("n of 4 confirmed", %, gradient bar on `chipBlue` track), a 2 × 2 grid of tappable tiles and the submit button. Tiles are `pageTint` with a white icon box + navy icon (single navy palette — no multi-colour accents); confirmed tiles turn into `gradients.button` tiles with white text + white tick. Primary gradient "Submit Check-In" — disabled (45% opacity) until all 4 are confirmed; after submit becomes a `chipBlue` "✓ Check-In Submitted" bar and the tiles lock. Footnote under the button.
  3. `NeighborhoodCard`: ONE white card; pill tab row (Schools / Hospitals / Parks, navy when selected, on a `pageTint` track) switches the list; numbered place rows (Playfair "01", name, uppercase meta, `chipBlue` distance pill with pin), hairline dividers. Tab state `placeTab` in `useCheckIn`. No header link (long title); a centred blue "View on Map →" link (`sectionLink`) closes the card → map (coming soon).
  4. `CuratedLivingCard` (photo = width × 0.56): interior photo (`living_curated.jpg`, Unsplash 1600210492486) with navy fade + gold kicker + Playfair title, white body with story and gold rule + "THE DIGITAL CURATOR STANDARD".
- **Typography** (standardised to Guest Home, presets only): hero name `heroTitle`, hero address `heroSubtitle`, pills / chips / distance `badge`, top bar title `sectionTitle`, section titles `sectionHeading` + `cardSubtitle` subtitle + `sectionLink`, status title `heroTitle`, body text `body`, fact values `bodyBold`, all eyebrows / meta `eyebrow` (no letterSpacing overrides), tile / place names `listingTitle`, hints `cardSubtitle`, progress count `price`, buttons `button`, tabs `bodyMedium`, footnote `caption`, curated title `sectionHeading`.
- **Logic**: `useCheckIn(residenceId, navigation)` — confirmed set, `canSubmit`, `submitted`, `toggleTask`, `submit` (Alert); key / places / map / profile show "coming soon". Mock data: `CHECK_IN_SUMMARY`, `CHECK_IN_TASKS`, `NEIGHBORHOOD`, `NEIGHBORHOOD_RADIUS`, `CURATED_LIVING`.
- **Icons** added to `src/assets/icons/renter/`: inspect, bolt, wifi, shield, key, check, school, hospital, park (white 128px line PNGs drawn with System.Drawing, tinted via `RenterIcon`).
### 1. Home Screen (`src/features/home/screens/HomeScreen.tsx`)
- **Role**: Primary executive operational dashboard.
- **Components**:
  1. `HeaderSection`: Deep navy linear gradient, brand monogram, live operations status, notification counter, Alex profile avatar.
  2. `AlertBanner`: Overlapping warning card (`-26dp` margin) for elevator modernization.
  3. `QuickActionBar`: 4 gradient actions (New event, Schedule, Availability, Share link) with `moderateScale(24)` vertical spacing.
  4. `AttentionSection`: Pending tour inquiry card for Sarah Johnson (Unit 402) with Review and Confirm buttons.
  5. `ScheduleSection`: Horizontal carousel of today's events (Stand-up, Client Walkthrough) with "View Calendar" action link.
  6. `PropertyActivitySection`: The Mercer Residences portfolio card with occupancy badge (94%) and featured apartment photo.
  7. `BottomNavBar`: Persistent bottom navigation.
  8. `DraggableFloatingButton`: Floating message dispatch shortcut.

### 2. Calendar Screen (`src/features/calendar/screens/CalendarScreen.tsx`)
- **Role**: Dedicated property showing schedule and tenant inspection command center.
- **Components**:
  1. `CalendarTopBar`: Dark navy bar (`#0B1D3A`) with Skyline Properties portfolio dropdown, Calendar Operations label, Search button, Notifications (badge 3), and Elena Vance (`EV`) avatar with green status indicator.
  2. `CalendarActionHeader`:
     - Kicker: `PROPERTY SHOWINGS & TENANT INSPECTIONS`
     - Title: `Calendar` (Playfair Display)
     - Action buttons: `↑ ICS` and `+ EVENT`
     - View mode switcher: `Month`, `Week`, `Day`, `Agenda` (dynamically switches between Month grid view, Week timeline, and Day inspection format).
  3. `CalendarMonthCard` (rendered when `viewMode === 'Month'`):
     - October 2026 header banner using high-fidelity Figma botanical asset (`calendar_month_header.png`) with sunlit wall, year, month dropdown, `< >` navigation pill, calendar picker shortcut, and interactive touch target overlays.
     - 5-week month grid with exact dot indicators per day.
     - Day 23 active selected circle in `#2563EB`.
     - Bottom strip: `Upcoming: Unit 402 →`.
  4. `TodayCapacityCard` (rendered when `viewMode === 'Month'`):
     - `Today's Capacity` title with `82% BOOKED` badge.
     - 4-segment progress bar: Showings (Blue), Inspections (Orange), Maintenance (Slate), Unfilled (Light gray).
     - Slot counts: `7 of 9 Showing slots filled` and `3 Left`.
     - Synchronization footer: `Synced with Google & Outlook 4 mins ago`.
  5. `CalendarWeekView` (rendered when `viewMode === 'Week'`):
     - Separated modular sections matching Figma layout: parent container has **no border and no shadows**.
     - **Section 1 (Header Card, 348 × 48 Hug)**: Dedicated card with `< >` navigation pill, `Oct 20–26, 2024` date range, `W43` week badge, and `Filters (2)` action button.
     - **Section 2 (Days Row, 348 × 48 Hug)**: Clean 7-day row (`Sun 20` – `Sat 26`) with `Wed 23` highlighted in an active blue badge (`#2563EB`).
     - **Section 3 (Alert Banner, 348 × 50 Hug)**: `Elevator Modernization (All-Day)` warning banner card with `Day 1 of 2` pill.
     - **Section 4 (Timeline Grid)**: Time-slotted schedule cards from 09:00 AM to 06:00 PM sitting cleanly on the screen background:
       - `09:00 AM`: Unit 104 Walkthrough (Sarah Li) with straight blue left stripe.
       - `10:00 AM`: Active selected card (`Unit 402 – Showing Tour`) with soft horizontal light gradient (`#4075E9` → `#94B0EA`), `Selected` tag, and `+15m travel buffer`.
       - HVAC Room Unit 3B with `Done` tag and straight green stripe.
       - `01:00 PM`: Virtual Consultation with `Meet` tag and straight purple stripe.
       - `03:00 PM`: Vendor Inspection with `Vendor P...` tag and straight orange stripe.
       - `04:00 PM`: Key Handover with `Key Hand` tag and straight teal stripe.
       - `06:00 PM`: Dashed divider line.
  6. `CalendarDayView` (rendered when `viewMode === 'Day'`):
     - Dedicated single-day inspection view matching Figma reference:
     - **Day Navigation Bar**: `<` chevron left, `• Wednesday, Oct 23` active blue capsule pill with white dot, `Today` neutral pill, and `>` chevron right.
     - **Alert Banner**: `Elevator Modernization (All-Day)` amber warning banner with `Day 1 of 2` status pill.
     - **ShowingTourCard**: Displays `Unit 402 – 2BR Luxury View` inspection sheet as the primary view content.
  7. `ShowingTourCard`:
     - Drag handle pill indicator.
     - `• SHOWING TOUR` dark pill badge + Edit, More options, and Close action buttons.
     - Unit title: `Unit 402 – 2BR Luxury View` + `The Mercer Residences • West End Tower`.
     - Featured apartment photo preview (`unit_402.jpg`, curved boucle sofa overlooking skyline) with `Available Nov 1` badge and `Unit 402 • $4,200/mo` dark scrim.
     - Schedule window: `Wednesday, Oct 23, 2024 • 10:00 AM – 10:45 AM (45 mins)` with `15 min travel buffer enforced`.
     - Prospect Details: `Marcus Reed` (`marcus.reed@example.com`, `+1 555-019-2834`) with quick SMS/Chat button.
     - 2 side-by-side columns: Assigned Agent (`Elena Vance`, `EV`) and Unit Specs (`2 Bed • 2 Bath`, `1,180 Sq Ft`).
     - Tour Notes: `Prospect requested key focus on balcony acoustics, parking bay access, and fiber optic pre-wiring.`
     - Primary button: `Open Showing Pack` (Linear gradient with briefcase icon).
     - Secondary buttons: `Reschedule` and `Cancel Tour`.
  8. `BottomNavBar`: Persistent bottom navigation with `variant="calendar"`.

### 3. Splash Screen (`src/features/splash`)
- **Role**: Initial cinematic branding and entrance screen.
- **Visual Design**:
  - **Ambient Background** (`AmbientBackground.tsx`):
    - Renders the authentic clean deep space navy artwork (`splash_bg.png`, 1080x2346 lossless 32-bit PNG) featuring sweeping luminous electric-blue wave streaks and an upper starlight burst.
    - Enhanced with spatial gradient debanding and high-frequency dithering to eliminate 8-bit color banding and emulator quantization steps.
    - Continuous multi-axis hardware-accelerated ambient motion (`useNativeDriver: true`): subtle pan/drift (`translateX`: -12px to +12px, `translateY`: -14px to +14px), slow breathing zoom (`scale`: 1.02 to 1.06), and soft wave luminescence bloom (`0.93` to `1.0`).
    - Uses local binary asset references loaded via Metro bundler (`splashAssets.ts`) ensuring 100% crash-free rendering and zero base64 decoding overhead.
    - Test-safe: loops are gracefully bypassed in test environments (`process.env.NODE_ENV === "test"`).
  - **Logo Badge** (`LogoBadge.tsx`):
    - Signature squircle card (`132dp` x `132dp`, `borderRadius: 38dp`, background `#060E22`, ice-blue luminous border `rgba(147, 197, 253, 0.42)`, glowing shadow `#0084FF`).
    - Authentic stylized `"Ni"` monogram (`splash_monogram.png`) with white stroke and cyan accent dot (`#0084FF`).
    - Shimmering 4-point diamond star sparkle flare (`splash_sparkle.png`) with 100% transparent alpha border (no bounding shroud) at top-right corner with gentle breathing pulse and rotation shimmer.
  - **Typography**:
    - Title: `"UrbanNest"` (`Playfair Display Bold`, `46pt`, `#FFFFFF`, subtle blue text-shadow).
    - Tagline: `"Mange your time ,effortlessly"` (`Inter Regular`, `16pt`, `rgba(255, 255, 255, 0.82)`).
  - **Entrance & Navigation**:
    - Staggered entrance animation (logo scale `0.92 ➔ 1.0`, text glide `18 ➔ 0`).
    - Automatic route transition to `Home` after display duration (default `2800ms`).
    - Full screen interactive tap-to-skip.

#### 3a. Splash Screen — Ambient Artwork Implementation (current code)
> Replaces the earlier skyline-built splash and supersedes the older image notes above (kept for history). Based on the supplied design `Urbannest Modern Architectural Splash.png` (logo, wordmark, tagline and building are baked into the artwork).

- **Concept**: the static artwork with living ambient motion; visible for **~6 seconds** (5.6s hold + 0.4s exit) then replaced by Home. Tap skips.
- **Dependencies**: none (RN `Animated`, native driver only).
- **Files**: `src/assets/images/splash_bg.png` (artwork); `src/features/splash/{assets/splashAssets.ts, constants.ts, hooks/useSplashSequence.ts, screens/SplashScreen.tsx, index.ts}`.
- **Animation**: 0.9s fade-in; whole scene slow pan (±2% of width) + breathing zoom (1.07→1.12); pulsing warm window glow over the building; twinkling spark on the orbit arc; drifting blue mist band. Overlays live inside the same transformed container so they track the artwork. Exit: fade + 1.05 scale.
- **Native vs in-app**: Android `AppTheme` windowBackground/status/nav bar = `#0B1D3A` (`values/colors.xml` `splashBackground`; keep in sync with `colors.headerDarkBlue`) → no white flash. iOS storyboard unchanged.
- **Flow**: `Splash` is `initialRouteName` (`gestureEnabled: false`, `animation: 'none'`) and ends with `navigation.replace('Home')` (fallback `navigationRef.reset`), so it never reappears and Back from Home exits.
- **Decisions**: overlay positions are fractions of screen size matched to the artwork (cover-fit); under `NODE_ENV === 'test'` no animation runs and completion fires on a 0ms timer; reduce-motion shows static art for 2s; timers/loops cleaned on unmount; exit guarded to fire once.
- **Tests**: `__tests__/SplashScreen.test.tsx`.

### 4. Navigation Flow
- **Splash ➔ GuestHome** (via `replace`, Splash leaves the stack):
  - Automatically when the splash sequence ends.
  - Instantly on tap anywhere on the splash screen.
- **GuestHome ➔ PersonaSelect**: "Log In / Sign Up" pill.
- **PersonaSelect ➔ RenterHome**: "Continue as Renter".
- **RenterHome ➔ ResidenceDashboard**: tap a current residence card.
- **RenterHome ➔ CheckIn**: tap a Move-In Ready card.
- **PersonaSelect ➔ Home**: "Continue as PMS".
- **Home ➔ Calendar**:
  - Tapping **View Calendar** in `ScheduleSection`.
  - Tapping **Schedule** in `QuickActionBar`.
  - Tapping **CALENDAR** in `BottomNavBar`.
- **Calendar ➔ Home**:
  - Tapping **HOME** in `BottomNavBar` or system back gesture.

---
## 11. Development Rules

1. **Design system fidelity**: no arbitrary colors or fonts. Colors come from `colors` / `gradients` in `theme.ts`, fonts from `typography`, text styles from `typographyPresets`.
   - **Typography is standardised to the Guest Home screen.** Every screen must reuse the same text styles the guest screen uses for the same kind of element. Never pick a font, weight or size because it looks nice.
   - Use a `typographyPresets` entry directly in the component (never copy its values into a local style). Do not override its `fontSize` / `lineHeight` / `letterSpacing`; only `color` and layout props (margin, flex, textAlign) may be added.
   - Same element = same style: logo text = `brandTitle`; big page title = `heroTitle` (30); title subtitle = `heroSubtitle`; section titles = `sectionHeading` / `displayTitle`; property card name = `listingTitle`; address / secondary text = `cardSubtitle`; meta values = `bodyBold`; prices = `price`; button text = `button`; segment labels = `bodyMedium`; status / count badges = `badge`; "Premium" badge = `commonStyles.premiumBadge` + gold `StarGlyph` + `premiumBadge` text; eyebrows = `eyebrow` (letterSpacing 1.4).
   - Pill button arrows = `ArrowCircleIcon` (`guest/components/GuestIcons.tsx`): navy circle + white ↗ on light buttons, white circle + navy ↗ on gradient buttons; button gets `paddingRight` ≈ 6. Do not use the bare `ArrowRightIcon` in buttons.
   - If no preset fits, add a new preset to `theme.ts` and list it in Section 8.3 first. Do not hand-write a one-off style.
2. **Spacing**: `spacing.sectionGap` (40dp) between page sections, `spacing.section` (24dp) between stacked cards, `spacing.screenHorizontal` (20dp) side margins.
3. **No native-linking dependencies** for icons/gradients — use `src/components/icons` and `src/components/LinearGradient.tsx`.
4. **Responsive scaling**: `moderateScale()` for margins, padding, sizes, radii; `scaleFont()` for font sizes.
5. **Structure**: features in `src/features/<name>/` with `components/`, `screens/`, `index.ts`; export publicly via the feature barrel and `src/features/index.ts`.
6. **Navigation**: child components get callbacks; only screens talk to navigation. Every route must be typed in `RootStackParamList`.
7. **State**: typed hooks only (`useAppDispatch` / `useAppSelector`); business logic in ViewModel hooks, not in screens.
8. **Animations**: `Animated` with `useNativeDriver: true`; skip loops when `process.env.NODE_ENV === 'test'`.
9. **Quality gate** before finishing: `npx tsc --noEmit`, `npm test`, `npm run lint`.

---

## 12. Bootstrap a New Project From This Config

1. **Create the app** (same RN version or latest):
   `npx @react-native-community/cli init <AppName> --version 0.88.1`
2. **Install runtime deps**:
   `npm i @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @reduxjs/toolkit react-redux axios`
3. **Install dev deps**:
   `npm i -D babel-plugin-module-resolver @types/react-redux`
4. **Copy config files** from Section 7 (`babel.config.js`, `tsconfig.json`, `metro.config.js`, `react-native.config.js`, `jest.config.js`, `jest.setup.js`, `.prettierrc.js`, `.eslintrc.js`) and change the root `App.tsx` to re-export `./src/app/App`.
5. **Copy the reusable `src/` skeleton** (generic, not UrbanNest-specific):
   - `src/app/` (App + providers)
   - `src/navigation/` (RootNavigator, navigationRef, types, index)
   - `src/store/` (index, rootReducer, hooks)
   - `src/services/` (api client, endpoints, types, tokenStorage)
   - `src/config/` (env.ts → change `appName` / `apiBaseUrl`; theme.ts → replace colors, fonts, gradients)
   - `src/utils/` (responsive, formatters, validators), `src/hooks/`, `src/types/`
   - `src/components/` (Button, Card, Input, LoadingIndicator, LinearGradient, icons)
   - `src/features/auth/` as the MVVM template for new features
6. **Fonts**: drop `.ttf` files in `src/assets/fonts/`, run `npx react-native-asset`, update font names in `theme.ts`.
7. **Navigation**: set `initialRouteName`, register screens, fill `RootStackParamList`.
8. **Reset UrbanNest-specific parts**: delete `features/home`, `features/calendar`, `features/splash` content (or keep as examples), clear Section 10 of this file, update Section 1 overview.
9. **Rebuild native**: `cd ios && bundle install && bundle exec pod install`, then `npm run android` / `npm run ios`.
10. **Verify**: `npx tsc --noEmit && npm test`.

---

## 13. Known Gaps / TODO

- `HomeScreen` / `CalendarScreen` type `navigation` as `any` — switch to `NativeStackScreenProps<RootStackParamList, 'Home'>`.
- `Auth` / `Main` routes and `AuthStackParamList` / `MainStackParamList` are declared but not mounted (no auth gating yet; `Login` is unreachable from UI).
- `tokenStorage` is in-memory — tokens are lost on app restart.
- `colors.buttonGradientStart` in `theme.ts` is `#032B57` while `gradients.button` uses `#03264C` — keep them consistent.
- Poppins fonts are still in `src/assets/fonts/` though deprecated.
- `useAppTheme` exposes `isDarkMode`, but there is no dark palette yet.
- `heroTitle` should be Playfair Display ExtraBold (800): add `PlayfairDisplay-ExtraBold.ttf`, link it, and switch the preset's font.
- Guest home: hero has 3 slides (design `hero_bg.png` + `hero_dusk_house.jpg` + `hero_pool_villa.jpg`, built by `scripts/brand/hero_grade.ps1`), auto-advancing every 5 s and looping; `rental_glass_villa.png` has the Premium badge baked in; need a text-free hero export; featured carousel still uses remote Unsplash images (city tiles are now bundled: `city_*.jpg` in `src/assets/images/guest/`, Unsplash License); Search / categories / See More / guides / cities buttons have no destination yet.

---

## 14. Instructions for Future AI Sessions

When a user requests the next screen:
1. **Read `project.md` first**.
2. **Inspect the reference screenshot** to identify sections, card hierarchy, buttons and state indicators.
3. **Reuse existing styles and components** (`BottomNavBar`, `LinearGradient`, icons, `theme.ts`, `responsive.ts`).
4. **Place new feature code** in `src/features/<new-feature>/`.
5. **Connect navigation** via `RootNavigator.tsx` and `src/types/navigation.ts` (checklist in Section 4).
6. **Run** `npx tsc --noEmit` and `npm test`.
7. **Update this file** (Section 10 + any changed architecture/config) before ending the session.
