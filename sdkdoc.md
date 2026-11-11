# Neyora SDK: how it works, how to sell it, how to protect it

> Written 2026-11-10. Status: **demo**. Neyora's screens (Home → Calendar) run inside other people's apps.
> Neyora source: `C:\neyora`. Buyer demos: `C:\UrbanNestMobile` (React Native), `C:\NeyoraAndroidDemo` (Kotlin), `C:\NeyoraFlutterDemo` (Flutter).

---

## 0. The idea in one picture

Neyora is our maintenance app. We want other companies ("buyers") to show Neyora's screens **inside their own app**, as if they were part of it. No WebView, no second app to install.

```
                      ┌──────────────────────────────┐
                      │  Neyora source (C:\neyora)   │
                      │  written once, React Native  │
                      └──────────────┬───────────────┘
                                     │ we pack it in different "boxes"
          ┌──────────────────────────┼───────────────────────────┐
          ▼                          ▼                           ▼
 ┌──────────────────┐      ┌───────────────────┐       ┌───────────────────┐
 │ npm package      │      │ Android library   │       │ (later) iOS       │
 │ .tgz             │      │ .aar + Maven folder│      │ .xcframework      │
 └────────┬─────────┘      └─────────┬─────────┘       └─────────┬─────────┘
          ▼                          ▼                           ▼
 React Native apps          Kotlin / Java apps          Swift / ObjC apps
 (UrbanNest)                Flutter (Android side)      Flutter (iOS side)
                            any tool that makes an
                            Android app (see §6)
```

**Key rule:** Neyora's screens are written **once**. Each platform only gets a thin "box" around them.

| Buyer's app | What we give them | How they open Neyora | Status |
| :--- | :--- | :--- | :--- |
| React Native | npm package `@neyora/maintenance-sdk` (`.tgz`) | `<Stack.Screen component={NeyoraModule} />` | ✅ working (UrbanNest) |
| Native Android (Kotlin/Java) | Maven folder with `com.neyora:maintenance-sdk` (`.aar`) | `Neyora.open(context)` | ✅ working (Kotlin demo, emulator) |
| Flutter (Android) | Same Maven folder + ~15 lines of bridge code | `MethodChannel('neyora').invokeMethod('open')` | ✅ builds; device test in progress |
| Native iOS / Flutter iOS | `.xcframework` (same tool) | `Neyora.present(from:)` | ⏳ not started (needs a Mac) |
| Web and others | see §6 | | ⏳ not started |

---

## 1. Method A: React Native buyers (npm package)

### In simple words
A React Native app already has React Native inside. So we only give it **Neyora's screen code**, packed like any normal library. The buyer installs it with `npm install` and adds one screen to their navigation. Neyora borrows React, navigation and Redux from the buyer's app.

### How it is built (technical)
Files in `C:\neyora\sdk\`:

| File | What it does |
| :--- | :--- |
| `index.tsx` | Public API. `NeyoraProvider` wraps Neyora's **own** Redux store (kept apart from the buyer's store). `NeyoraModule` = provider + a nested native stack: `Home` → `Calendar`. No `NavigationContainer`, no splash, no StatusBar/SafeArea provider: the buyer's app owns those. |
| `index.d.ts` | Public TypeScript types, so the buyer's `tsc` doesn't type-check Neyora's source. |
| `package.json` | Name `@neyora/maintenance-sdk`, version, and **peerDependencies**: react, react-native, @react-navigation/native + native-stack, @reduxjs/toolkit, react-redux, react-native-safe-area-context. "Peer" = the buyer's app must provide them. |
| `build.js` | Packs the package (below). |

What `node sdk/build.js <out>` does:
1. Starts at `sdk/index.tsx` and **follows every import** (incl. `.ios`/`.android` files). Only files the SDK really uses are packed (no fonts, splash or unused images).
2. **Rewrites `@/...` imports into relative paths.** Both apps use `@/` to mean "my own `src`". Without this, the buyer's bundler would load the buyer's files instead of Neyora's.
3. **Checks** every imported library is a peer dependency, else stops with a clear message.
4. Runs `npm pack` → `neyora-maintenance-sdk-<version>.tgz`.

How UrbanNest uses it:
```jsonc
// package.json
"@neyora/maintenance-sdk": "file:vendor/neyora-maintenance-sdk-0.1.0.tgz"
```
```tsx
// src/navigation/RootNavigator.tsx
import { NeyoraModule } from '@neyora/maintenance-sdk';
<Stack.Screen name="Neyora" component={NeyoraModule} options={{ animation: 'slide_from_right' }} />
```
The "Scheduling" shortcut on the Manage page calls `navigation.navigate('Neyora')`.

### Updating the npm package after changing Neyora
This is only about the **npm package** (the box for React Native apps). The Android library is rebuilt separately (Method B). Full release steps for both: §7.

1. Give the npm package a new version number: `"version"` in `C:\neyora\sdk\package.json` (e.g. `0.1.0` → `0.2.0`).
2. New screen? Register it in `C:\neyora\sdk\index.tsx` (same Stack as Home and Calendar). Changed an existing screen? Skip this.
3. Rebuild it: `node sdk/build.js ../UrbanNestMobile/vendor` → `neyora-maintenance-sdk-<version>.tgz`.
4. In the React Native app (UrbanNest):
   ```bash
   npm install "@neyora/maintenance-sdk@file:vendor/neyora-maintenance-sdk-<version>.tgz"
   npm start -- --reset-cache
   ```
   Delete the old `.tgz` from `vendor/`. If `build.js` asked for a new peer dependency, also `npm install <library>` here (native library → rebuild with `npm run android`).
5. Later, with a private npm registry, buyers just run `npm install @neyora/maintenance-sdk@<version>`.

### Rules for this method
- Inside Neyora, move between screens with the **`navigation` prop**, never Neyora's global `navigate()` helper (that one controls Neyora's own app container, which doesn't exist inside a buyer app).
- If a Neyora screen starts using a new library, the **buyer must install it too**. If it is a native library (camera, maps…), they must rebuild their app.
- The buyer's React Native version must be close to ours (0.88). Very different versions can break.

---

## 2. Method B: native Android buyers (Android library)

### In simple words
A Kotlin or Java app has **no React Native**. So we pack Neyora's screens **together with a small React Native engine** into one Android library. The buyer adds it like any Android library and calls `Neyora.open(context)`. A full-screen Neyora page opens; Back on Neyora's Home returns to their app. They never see React Native, Node, npm or our source code.

```
Buyer's Kotlin app                        Our Android library (.aar)
┌────────────────────┐   Neyora.open()   ┌──────────────────────────────────┐
│ their screens      │ ────────────────► │ NeyoraActivity (full screen)     │
│ their theme        │                   │  └─ React Native engine (Hermes) │
│ no React Native    │ ◄──── Back ────── │      └─ Neyora Home → Calendar   │
└────────────────────┘                   └──────────────────────────────────┘
```

### Tools used
- **`@callstack/react-native-brownfield` 6.0.1** (+ `@callstack/brownfield-cli`): open-source tool by Callstack for putting React Native inside native apps. Its Gradle plugin `com.callstack.react:brownfield-gradle-plugin:2.0.0-alpha11` builds a **"fat AAR"**: one library file that contains everything (note: the plugin version is an *alpha*; re-check before production).
- React Native 0.88.1, Hermes JS engine, Android Gradle Plugin 9.2.1, Gradle 9.4.1.

### Files (all in `C:\neyora`)

| File | What it does |
| :--- | :--- |
| `sdk/standalone.tsx` | `NeyoraApp` = `SafeAreaProvider` + `NavigationContainer` + `NeyoraModule`. A native app has neither, so Neyora brings its own here. A "back" that nobody handles (we're on Neyora Home) calls `ReactNativeBrownfield.popToNative()` → back to the buyer's screen. |
| `sdk/android-entry.js` | JavaScript entry of the library: `AppRegistry.registerComponent('NeyoraApp', ...)`. |
| `android/app/build.gradle` | Only when built with `-PneyoraSdk`: bundle `sdk/android-entry.js` instead of `index.js` (so the splash and other app-only code stay out). Normal Neyora app builds are unchanged. |
| `android/settings.gradle`, `android/build.gradle` | Add the library module and the brownfield Gradle plugin. |
| `android/neyorasdk/build.gradle.kts` | The library module. Publishes `com.neyora:maintenance-sdk:<version>` (**version is set here**). Depends on `com.facebook.react:react-android:0.88.1` and `com.facebook.hermes:hermes-android:260318099.0.5`. Publishes **debug and release** variants. |
| `android/neyorasdk/.../Neyora.kt` | **Public API**: `Neyora.init(application, apiKey)` (optional, starts the engine early so the first open is fast) and `Neyora.open(context)`. |
| `android/neyorasdk/.../NeyoraActivity.kt` | The full-screen page. An `AppCompatActivity` showing `NeyoraApp` via `ReactNativeBrownfield.shared.createView(...)`; passes `apiKey` as a prop. |
| `android/neyorasdk/.../ReactNativeHostManager.kt` | Starts the React Native engine once per app process. `useDevSupport = false`: always reads JavaScript packed inside the library, never a Metro dev server. |
| `android/neyorasdk/src/main/AndroidManifest.xml` | Declares `NeyoraActivity` (theme `Theme.Neyora`) and the INTERNET permission. |
| `android/neyorasdk/src/main/res/values/styles.xml` | `Theme.Neyora` = `Theme.AppCompat.DayNight.NoActionBar` (same as the Neyora app). Plus `drawable/rn_edit_text_material.xml` (text-box background it needs). |
| `sdk/build-android.js` | `node sdk/build-android.js [out-dir]` → builds and publishes to `sdk/build/android-maven/`. |

### What is inside the library
```
maintenance-sdk-0.1.0-release.aar  (~6.6 MB)
├── assets/index.android.bundle      Neyora's JavaScript (Hermes bytecode)
├── res/drawable-*/...               Neyora's images
├── jni/<cpu>/libappmodules.so       native code that registers Neyora's native views
├── jni/<cpu>/libreact_codegen_*.so  react-native-screens, safe-area-context
├── jni/<cpu>/librnscreens.so
└── classes.jar                      Neyora, NeyoraActivity, brownfield helper, PackageList
CPU types: arm64-v8a, armeabi-v7a, x86_64  (32-bit x86 left out: old emulators only)
```
React Native itself (`react-android`) and Hermes are **not** copied in. The `.pom` file lists them and Gradle downloads them from Maven Central on the buyer's first build.

**Why a Maven folder and not just the `.aar` file?** A bare `.aar` doesn't tell Gradle what else to download. The Maven folder includes the `.pom`/`.module` files with the dependency list, so the buyer's build just works.

### How the buyer adds it
```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()                       // React Native's Android parts
        maven { url = uri("neyora-sdk") }    // the folder we send
    }
}
// app/build.gradle.kts   (minSdk 24+, compileSdk 37)
implementation("com.neyora:maintenance-sdk:0.1.0")

// Application.onCreate (optional, faster first open)
Neyora.init(this, apiKey = "THEIR_KEY")

// any button
Neyora.open(this)
```

### Problems we hit while testing, and the fixes (already in the SDK)

| What happened | Why | Fix |
| :--- | :--- | :--- |
| Buyer build: "Could not find `com.facebook.react:hermes-android:0.88.1`" | Hermes moved to its own Maven group; inside the Neyora app React Native renames it silently, outside it doesn't | Depend on `com.facebook.hermes:hermes-android:260318099.0.5` (version = `HERMES_VERSION_NAME` in `node_modules/react-native/sdks/hermes-engine/version.properties`; update with React Native) |
| App crashed when opening Neyora (native crash) | Buyer debug app got React Native's **debug** native files, but our library only had **release** native files; they don't fit together | Publish **both** variants; Gradle picks the one matching the buyer's build. Both read JS from inside the library (no Metro) |
| "requires your app theme to be Theme.AppCompat" | Neyora's page used Android's basic theme; React Native text inputs need AppCompat | `Theme.Neyora` (AppCompat), set on `NeyoraActivity`. This is **our** page only; the buyer's theme doesn't matter |
| "NeyoraActivity cannot be cast to AppCompatActivity" | react-native-screens expects an AppCompatActivity | `NeyoraActivity : AppCompatActivity()`; also `super.onCreate(null)` as react-native-screens requires |

### Updating the Android library after changing Neyora
This is only about the **Android library** (the box for Kotlin / Flutter apps). The npm package for React Native apps is rebuilt separately with `node sdk/build.js` (Method A). Full release steps for both: §7.

1. Give the Android library a new version number: `version` in `C:\neyora\android\neyorasdk\build.gradle.kts`.
2. Rebuild it: `node sdk/build-android.js` (first build ~8 min, then 1–5 min).
3. Send the new folder `sdk/build/android-maven/` to Kotlin / Flutter buyers (later: publish to a private registry, §5).

New libraries used by Neyora's screens are added to the Android library automatically, as long as they're installed in Neyora.

---

## 3. Method C: Flutter buyers (Android side)

### In simple words
A Flutter app is written in Dart, but every Flutter app also contains a normal Android project (its `android/` folder). That Android part uses **the same library as Method B**. Flutter has a built-in way for Dart to call Kotlin, a **platform channel**, so a button in Dart can call `Neyora.open()`.

```
Dart button ──MethodChannel('neyora').invokeMethod('open')──► MainActivity.kt ──► Neyora.open(this)
```

### What the Flutter buyer adds (`C:\NeyoraFlutterDemo` is the working example)
```kotlin
// android/build.gradle.kts → allprojects.repositories
maven { url = uri("$rootDir/neyora-sdk") }

// android/app/build.gradle.kts
android { compileSdk = 37 }                       // Flutter's default is 36; React Native 0.88 needs 37
dependencies { implementation("com.neyora:maintenance-sdk:0.1.0") }

// android/app/src/main/kotlin/.../MainActivity.kt
class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "neyora")
            .setMethodCallHandler { call, result ->
                if (call.method == "open") { Neyora.open(this); result.success(null) }
                else result.notImplemented()
            }
    }
}
```
```dart
// any Flutter button
const MethodChannel('neyora').invokeMethod('open');
```

Notes:
- Neyora opens as its **own** Android page, so Flutter's `FlutterActivity` (not AppCompat) doesn't matter.
- In the demo, `ndkVersion` is set to `27.1.12297006` only because that NDK is the one installed on our computer (Flutter 3.47.9 wanted 28.2). Buyers can keep Flutter's default.
- **Later, nicer option:** ship a Flutter plugin (`neyora_sdk` on a private pub server or git) that contains these 15 lines, so the buyer only writes `Neyora.open()`. It also lets us add iOS without the buyer changing their Dart code.

---

## 4. How the pieces fit (all methods)

```
C:\neyora\src\                Neyora's screens, store, theme, images (one codebase)
     │
     ├── sdk\index.tsx         NeyoraModule  (needs a host navigation container)
     │      └── build.js ─────────────► .tgz            → React Native apps
     │
     └── sdk\standalone.tsx    NeyoraApp = own containers + NeyoraModule
            └── android-entry.js
                   └── android\neyorasdk + build-android.js
                                   └─► Maven folder (.aar) → Kotlin/Java, Flutter, …
```
A fix in a Neyora screen reaches every platform after re-running the two build scripts.

---

## 5. Going from demo to production

### 5.1 What still needs to be built (in order)

| # | Work | Why |
| :--- | :--- | :--- |
| 1 | **Licence + login on the backend** (see §5.3) | Today `apiKey` is accepted but **not checked**; anyone with the file can use Neyora |
| 2 | **Multi-tenant backend**: every record has a `tenant_id`; each buyer sees only its own data | Several companies share one Neyora backend |
| 3 | SDK API for sessions: `Neyora.open(context, sessionToken)` / `NeyoraModule sessionToken` prop, token refresh callback, error screen | Users must be identified and blocked properly |
| 4 | Events back to the buyer app (`onClose`, `onError`, `onSubscriptionInactive`), using brownfield's `postMessage` / `onMessage` | Buyer can hide the button or show their own message |
| 5 | `theme` option (brand colours, logo) | Buyers want it to look like their app |
| 6 | Distribution: **chosen model = free public download + licence key (§5.4)**: npm package on npmjs.com, Android library on Maven Central. (Alternative, not chosen: private registry with per-buyer tokens, e.g. GitHub Packages / Cloudsmith / JFrog) | No more sending folders by hand; protection is the server-side licence check |
| 7 | Release hygiene: semantic versions (1.2.3), changelog, signed artifacts, R8/ProGuard consumer rules, keep JS source maps for crash reports | Buyers need to trust and debug updates |
| 8 | Crash/usage reporting from the SDK (e.g. Sentry, tagged by tenant + SDK version) | We will see problems before buyers report them |
| 9 | Size check of a **release** buyer app with/without Neyora; publish the number | Buyers will ask "how much bigger does my app get?" |
| 10 | Compatibility matrix + automated sample-app builds (RN, Kotlin, Flutter) on every SDK release | Catches problems like the 4 we hit in §2 automatically |
| 11 | iOS `.xcframework` (`brownfield package:ios`, needs a Mac) + Flutter plugin with iOS side | iPhone buyers |
| 12 | Legal: licence agreement, privacy / data-processing terms (GDPR etc.), support SLA | Required for selling to companies |

### 5.2 Documentation to give buyers

| Document | Contents |
| :--- | :--- |
| **Overview** | What Neyora does, screens included, screenshots, requirements |
| **Requirements & compatibility** | Android minSdk 24, compileSdk 37; React Native version range; Flutter version; app size impact; CPU types; permissions (INTERNET) |
| **Quick start per platform** | React Native, Android (Kotlin/Java), Flutter, later iOS: install, 3–5 lines of code, "you should now see…" |
| **Authentication guide** | How to get keys, how their backend creates a session token for a user, token refresh (§5.3) |
| **API reference** | `Neyora.init`, `Neyora.open`, `NeyoraModule` props, events/callbacks, error codes |
| **Configuration** | Environment (sandbox/production), theme options, language |
| **Troubleshooting** | Known build errors and fixes: compileSdk, duplicate `libc++_shared.so` (`packaging { jniLibs { pickFirsts += "**/libc++_shared.so" } }`), R8 rules, React Native version conflicts |
| **Release notes / changelog + upgrade guides** | What changed in each version, breaking changes, how to upgrade |
| **Sample apps** | Cleaned-up versions of our three demo apps |
| **Security & privacy** | What data the SDK collects and sends, where it's stored, how it's protected |
| **Support & SLA** | Contact, response times, status page |

### 5.3 Authorization: how paying buyers get in and others are blocked

**Important truth:** anything we put inside the buyer's app (the library, an `apiKey`) can be copied by someone who unpacks the app. So **the real check must happen on our server**, not inside the SDK. The SDK only carries a pass; the server decides whether the pass is valid.

**The pieces:**
```
Tenant (buyer company)  ── has ──►  Subscription: active | trial | past_due | cancelled
        │
        ├── Publishable key   (in their app, identifies the tenant, NOT secret)
        ├── Secret key        (only on their server, never in the app)
        └── App registration  (Android package name + signing certificate, iOS bundle id)
```

**Flow for each user session:**
```
 Buyer's app          Buyer's server                 Neyora server
     │  user logs in       │                               │
     │────────────────────►│                               │
     │                     │ POST /v1/sessions             │
     │                     │ (secret key, their user id) ─►│ checks: key valid?
     │                     │                               │ subscription active?
     │                     │◄── session token (15–60 min) ─│ (signed JWT: tenant, user, expiry)
     │◄── token ───────────│                               │
     │ Neyora.open(context, token)                         │
     │  SDK calls API with token ─────────────────────────►│ checks EVERY request:
     │                                                     │  token signature + expiry
     │                                                     │  tenant subscription active
     │                                                     │  app package / bundle id allowed
     │◄────────── data, or 401 / 402 / 403 ────────────────│
```

**What happens when the subscription is not valid:**

| Situation | Server answer | What the SDK does |
| :--- | :--- | :--- |
| Token expired | `401 token_expired` | Asks the buyer app for a new token (refresh callback), retries |
| Subscription cancelled / unpaid | `402 subscription_inactive` | Shows a "Service unavailable, contact your provider" screen, sends `onSubscriptionInactive` to the buyer app |
| Key revoked / unknown app | `403 forbidden` | Same screen, `onError` event |
| Buyer app version too old | `426 sdk_upgrade_required` | "Please update the app" screen |

**Extra controls:**
- **Start-up check:** `Neyora.init` calls `GET /v1/sdk/config` → `{ enabled: true/false, minSdkVersion, theme }`. If disabled, `Neyora.isAvailable()` returns false so the buyer can hide the Calendar button.
- **Billing link:** our payment system (e.g. Stripe) sends webhooks → we update the tenant's status automatically. Allow a **grace period** (e.g. 7 days `past_due`) before blocking.
- **Kill switch:** we can disable a tenant or a key instantly from an admin panel.
- **Data isolation:** every database row has `tenant_id`; queries always filter by the tenant in the token (database row-level security as a second safety net).
- **Stronger app check (optional):** Google **Play Integrity** (Android) / **App Attest** (iOS) prove requests come from the buyer's real, unmodified app.
- **Usage metering:** count active users / bookings per tenant for billing and limits.
- **Audit log:** who did what, per tenant.
- **Offline:** cache only non-sensitive data; never let the cache bypass the server check.
- **Access to new SDK versions:** only relevant with a private registry (not chosen, see §5.4). With free public download, the licence key is the only lock.

### 5.4 Chosen model: free download + licence key (like Stripe, Nutrient, Scandit)

**In simple words:** anyone can download the SDK, but it only works with a **licence key** that **our server** checks. Copying the SDK is useless without a paid key. No GitHub accounts or download tokens for buyers. (This replaces the private-registry idea in §5.1 #6.)

```
1. Buyer pays (Stripe)          ──► our server creates their licence key  🔑 nk_live_abc123
2. Buyer downloads the SDK      ──► from public npmjs.com / Maven Central
3. Buyer puts the key in code   ──► Neyora.init(this, licenseKey = "nk_live_abc123")
4. Neyora opens                 ──► SDK asks our server: "is this key valid?"
5. Server answers               ──► ✅ valid → Neyora works
                                    ❌ unpaid / cancelled → "Service unavailable" screen
```

#### Part 1: Server: licence table
```
Licence key        Company     Allowed app       Status      Valid until
nk_live_abc123     Acme Corp   com.acme.app      active      2027-01-31
nk_live_xyz789     Beta Ltd    com.beta.homes    cancelled   2026-10-01
```
- **Allowed app**: the key only works in that buyer's app (Android package name / iOS bundle id). Acme's key copied into another app is refused.
- **Status**: `active` | `trial` | `past_due` (payment late, grace period) | `cancelled`.

#### Part 2: Server: check endpoint + key on every request
- New endpoint `POST /v1/sdk/verify`. The SDK sends `key`, `app` (package name), `sdkVersion`.
- Server checks: key known? app allowed? status active? SDK version still supported? Answer:
  ```
  ✅ { valid: true,  company: "Acme Corp", features: [...], checkAgainAfter: "..." }
  ❌ { valid: false, reason: "subscription_inactive" | "app_not_allowed" | "sdk_upgrade_required" }
  ```
- **Every** other Neyora API call (bookings, calendar data…) also carries the key, and the server refuses data for invalid keys. **This is the real lock**; the SDK screen is only the polite message.
- Every database row has the buyer's `tenant_id`, so each buyer only sees its own data.

#### Part 3: Payment: Stripe
```
Buyer pays on a Stripe checkout page
   └─► Stripe webhook "paid"       → server creates the key, emails it to the buyer
Payment fails / buyer cancels
   └─► Stripe webhook "cancelled"  → server sets status = cancelled (after a grace period, e.g. 7 days)
```
Webhooks are automatic messages from Stripe to our server: nobody blocks buyers by hand. Admin panel extras: create trial keys, revoke a key instantly, add allowed apps.

#### Part 4: SDK changes (in `C:\neyora`)
| Where | Change |
| :--- | :--- |
| Public API | Licence key becomes **required**: `Neyora.init(application, licenseKey)` (Android), `<NeyoraModule licenseKey="..." />` (React Native). Today it is `apiKey`, accepted but **not checked**. |
| On open | SDK calls `/v1/sdk/verify` before showing Neyora's screens. |
| `src/services/api/client.ts` | Request interceptor adds headers to every call: `X-Neyora-Key`, `X-App-Id`, `X-SDK-Version`. |
| Blocked screen | New screen "Service unavailable, contact your provider" when the key is invalid. |
| Events to the buyer app | `onLicenseInvalid` (React Native prop / Android callback) + `Neyora.isAvailable()`, so the buyer can hide their button. |
| Offline | Keep the last ✅ answer for a short time (e.g. 3 days), then block until online. |
| Android app id | Read automatically from the app (`context.packageName`), not typed by the buyer. |

#### Part 5: Public publishing
| Box | Where | One-time setup |
| :--- | :--- | :--- |
| npm package (React Native) | **npmjs.com** (public) | Free npm organisation `neyora`; remove `"private": true` from `sdk/package.json`; `npm publish --access public` |
| Android library | **Maven Central** (public) | Verify ownership of the `com.neyora` namespace (DNS record on `neyora.com`) in the Sonatype Central Portal; sign files with a GPG key; add sources/javadoc files and POM info (name, description, licence, developers, project URL) |

**Before the first public release:**
- Ship **compiled + minified JavaScript** in the npm package instead of our `.tsx` source (change `sdk/build.js`).
- Turn on **R8 obfuscation** for the Android library.
- Make the **Neyora GitHub repo private** (today `github.com/devwebknots/Neyora--Mobile` is public: anyone can read the full source).

#### When a buyer stops paying
```
Stripe "cancelled" ──► server status = cancelled ──► next time Neyora opens in their app: "Service unavailable" 🚫
```
They still have the SDK files, but without a valid key they get no screens and no data.

#### Build order
```
1. Make the Neyora repo private                                  (5 minutes, do now)
2. Server: licence table + /v1/sdk/verify + key check on all API calls + tenant_id on data
3. SDK: required licenseKey, verify on open, headers, blocked screen, events, offline grace
4. Stripe: checkout page + webhooks → create / cancel keys automatically, admin panel
5. Compiled JS (build.js) + R8 obfuscation
6. Publish to npmjs.com and Maven Central
7. Buyer docs: "get your key → install → Neyora.init(key)"
```

**Limit:** a skilled attacker could fake the app id header. Later, add **Google Play Integrity** (Android) and **App Attest** (iOS) to prove requests come from the buyer's real, unmodified app. User-level login (session tokens, §5.3) can be added on top for buyers who need per-user access.

---

## 6. Can this work on any platform?

**Yes, practically any platform that can show a native Android page, a native iOS page, or a web page.** Neyora's screens stay the same; only the thin box changes.

| Buyer's technology | How they would use Neyora | Status |
| :--- | :--- | :--- |
| React Native (CLI or Expo dev build) | npm package (Method A) | ✅ done |
| Native Android (Kotlin / Java, Views or Jetpack Compose) | Android library (Method B) | ✅ done |
| Flutter (Android) | Android library + platform channel (Method C) | ✅ built |
| Flutter (iOS) | iOS framework + platform channel | ⏳ needs iOS build |
| Native iOS (Swift / ObjC, UIKit or SwiftUI) | iOS `.xcframework` from the same brownfield tool | ⏳ needs a Mac |
| Kotlin Multiplatform / Compose Multiplatform | Android library on Android, iOS framework on iOS | ⏳ uses the two above |
| .NET MAUI / Xamarin | Android "binding library" around our `.aar`; iOS binding around the `.xcframework` | ⏳ binding project needed |
| Ionic / Capacitor / Cordova | Small Capacitor/Cordova plugin that calls `Neyora.open()` | ⏳ plugin needed |
| Unity (Android/iOS games) | Unity native plugin calling the Android library / iOS framework | ⏳ plugin needed |
| Web apps / anything else | **Web build** of Neyora (react-native-web) on a Neyora URL, embedded with an `<iframe>` or a WebView; same token login | ⏳ not started |

**Limits to keep in mind:**
- **React Native buyers must use the npm package**, not the Android library: two React Native engines in one app conflict.
- Each native library Neyora's screens use must work on every platform we ship (and need a web fallback for the web build).
- The Android/iOS libraries add React Native's size to the buyer's app.
- Buyer's Android settings must meet ours: minSdk 24+, compileSdk 37 (React Native 0.88).

---

## 7. When Neyora gets new screens or features: updating buyer apps

### In simple words
Neyora's code is **copied into the buyer's app when they build it**. So when we change Neyora:
1. we **rebuild** the SDK boxes (npm package, Android library) with a **new version number**,
2. we **send / publish** the new version,
3. the buyer **changes the version number** in their project, rebuilds, and releases their app to the store.

Their users only see the change after step 3. We can't push it into their app ourselves (yet, see §7.6).

```
 We change Neyora ──► rebuild SDK (new version) ──► buyer updates version ──► buyer releases app ──► users see it
     (C:\neyora)        build.js / build-android.js     1 line                   Play Store / App Store
```

### 7.1 What kind of change is it?

| Change in Neyora | Extra work for us | Extra work for the buyer |
| :--- | :--- | :--- |
| **Existing screen changed** (design, text, bug fix, logic) | None, just rebuild | Update version number |
| **New screen** reached from inside Neyora (e.g. a "Requests" button on Neyora Home) | Register the screen in `sdk/index.tsx` | Update version number |
| **New screen the buyer should open directly** (e.g. their own "Requests" button) | Register it + add a start-screen option to the API (e.g. `Neyora.open(context, screen = "Requests")`, `NeyoraModule initialRoute` prop). *Not built yet.* | Update version + call the new option |
| **New JavaScript-only library** (date formatting, etc.) | Android: nothing. npm package: add it to `peerDependencies` (build.js tells you) | React Native buyers: `npm install <library>`. Android/Flutter buyers: nothing |
| **New native library** (camera, maps, pickers…) | Android: install it in Neyora, rebuild (autolinking adds it). npm: add to `peerDependencies`. Check it works on every platform we ship | React Native buyers: install it + rebuild the app. Android/Flutter buyers: nothing extra, maybe a new permission |
| **New permission** (camera, location…) | Add it to `android/neyorasdk/src/main/AndroidManifest.xml`; document it | Know about it (it shows in their store listing); may need a privacy text |
| **React Native upgrade** in Neyora | Update the `react-android` and `hermes-android` versions in `android/neyorasdk/build.gradle.kts` (Hermes version from `node_modules/react-native/sdks/hermes-engine/version.properties`); re-test all demos | Android/Flutter: maybe a higher `compileSdk`/`minSdk`. React Native buyers: must upgrade their React Native too (**breaking change**) |
| **Backend / API change** only | Keep the old API working until old SDK versions are gone | Nothing, if we stay backward compatible |

### 7.2 Version numbers (semantic versioning)
`MAJOR.MINOR.PATCH`, e.g. `1.4.2`:
- **PATCH** (1.4.**3**): bug fixes, no change for the buyer's code.
- **MINOR** (1.**5**.0): new screens/features, old code still works.
- **MAJOR** (**2**.0.0): buyer must change something (React Native upgrade, removed option, higher minSdk).

Set the **same** version in both places:
- `C:\neyora\sdk\package.json` → `"version"` (npm package)
- `C:\neyora\android\neyorasdk\build.gradle.kts` → `publishing { ... version = "..." }` (Android library)

### 7.3 Our steps for every release

```
1. Build & test the change in the Neyora app itself (npm run android)
2. New screen? → register it in C:\neyora\sdk\index.tsx (same Stack as Home and Calendar):
       import { RequestsScreen } from '../src/features/maintenance';
       <Stack.Screen name="Requests" component={RequestsScreen} />
   (move between Neyora screens only with the navigation prop: navigation.navigate('Requests'))
3. Bump the version in sdk/package.json AND android/neyorasdk/build.gradle.kts
4. Build:
       node sdk/build.js <out>            → neyora-maintenance-sdk-<version>.tgz
       node sdk/build-android.js <out>    → android-maven/ (com.neyora:maintenance-sdk:<version>)
5. Test in all demo apps:
       UrbanNest (React Native)  → npm install the new .tgz, npm start -- --reset-cache, npm run android
       C:\NeyoraAndroidDemo      → copy android-maven to neyora-sdk/, change version, gradlew installDebug
       C:\NeyoraFlutterDemo      → copy to android/neyora-sdk/, change version, flutter build apk --debug, adb install
   Check: open Neyora → new screen works → Back returns to the host app. Test a release build too.
6. Write the changelog / release notes (what's new, breaking changes, new permissions)
7. Publish: send the files now; later publish to the private npm / Maven registries
8. Tell buyers (email / portal), with upgrade steps for MAJOR versions
```

### 7.4 What the buyer does

**React Native buyer:**
```bash
npm install @neyora/maintenance-sdk@1.5.0        # today: the new .tgz file path
# only if the release notes list new libraries: npm install <library>
npx react-native start --reset-cache             # then rebuild: npm run android / ios
```

**Android (Kotlin/Java) buyer:**
```kotlin
// app/build.gradle.kts: change only the number
implementation("com.neyora:maintenance-sdk:1.5.0")
```
(Today: also replace their `neyora-sdk` folder with the new one we send. With a private Maven registry they only change the number.)

**Flutter buyer:** same as Android, in `android/app/build.gradle.kts`. Their Dart code and bridge stay the same, unless they want a new option like opening a specific screen.

Then every buyer **rebuilds and releases their app** to the stores.

### 7.5 Things to keep in mind
- **Old versions stay in the wild.** Users who don't update their app keep the old Neyora. The backend must keep working for old SDK versions, or answer `426 sdk_upgrade_required` (§5.3) once a version is too old.
- **Don't rename or remove screens / options in a MINOR release.** Buyers may open them directly.
- **One Neyora codebase, all platforms:** a new screen reaches React Native, Android, Flutter and later iOS/web in the same release, as long as it only uses libraries that work on all of them.
- **Re-run the demo apps on every release.** Most problems we found (§2) only show up in a non-React Native app.

### 7.6 Later: updates without the buyer re-releasing (optional)
Most Neyora changes are JavaScript (screens, logic). It's possible to download a new JavaScript bundle at start-up ("over-the-air" update, like Expo Updates / CodePush) so small fixes reach users without a new store release. Limits: only JavaScript and images (not native libraries or permissions); must follow App Store / Play Store rules; needs careful version matching with the native part; buyers must agree to it. Worth considering once there are many buyers.

---

## 8. Quick reference: commands

```bash
# React Native package (in C:\neyora)
node sdk/build.js ../UrbanNestMobile/vendor
# then in UrbanNest:
npm install "@neyora/maintenance-sdk@file:vendor/neyora-maintenance-sdk-<version>.tgz"

# Android library (in C:\neyora)
node sdk/build-android.js                 # → sdk/build/android-maven/
# copy that folder into the buyer app (demo: C:\NeyoraAndroidDemo\neyora-sdk,
#                                           C:\NeyoraFlutterDemo\android\neyora-sdk)

# Install the demos on the emulator
cd C:\NeyoraAndroidDemo; .\gradlew installDebug
adb install -r C:\NeyoraFlutterDemo\build\app\outputs\flutter-apk\app-debug.apk
```
