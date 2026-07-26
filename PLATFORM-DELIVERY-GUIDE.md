# IDI APP — All Platform Delivery Guide

This prototype is designed from one shared product source so the visual identity, features, and content stay consistent across every platform.

## 1. Desktop Web

- Target users: public visitors, members, IDI staff, management, board users.
- Entry point: `index.html`
- Optimized for wide dashboards, full reports, business directory, admin CMS, pipeline, and analytics.
- Recommended production stack: responsive web frontend + secure backend API + database + cloud hosting.

## 2. Mobile Web App / PWA

- Target users: members, companies, investors, partners, and public guests.
- Current support:
  - `manifest.webmanifest`
  - `sw.js`
  - iOS/Android safe-area styling
  - install prompt layer
  - mobile bottom navigation
  - touch-friendly buttons and cards
- User can install from browser:
  - Android: browser install prompt / Add to Home Screen.
  - iOS: Safari Share → Add to Home Screen.

## 3. iOS App

- Recommended implementation: wrap the same web app UI inside a native iOS container using Capacitor or a native Swift WebView shell.
- Required production tasks:
  - Apple Developer account
  - App icon set
  - Splash screen
  - Push notification certificate/APNs
  - App Store privacy labels
  - API security review
  - TestFlight release
- Design behavior:
  - iOS-style rounded cards
  - safe-area support
  - bottom tab navigation
  - full-screen standalone app mode

## 4. Android App

- Recommended implementation: wrap the same web app UI using Capacitor or Trusted Web Activity.
- Required production tasks:
  - Google Play Console account
  - Adaptive icon
  - Firebase Cloud Messaging for push notifications
  - Play Store listing assets
  - Android signing key
  - Internal testing release
- Design behavior:
  - Android-friendly touch targets
  - app install prompt
  - standalone display
  - offline shell caching

## Recommended Production Path

1. Finalize UI/UX and Figma screens.
2. Build secure backend API and database.
3. Connect login, roles, CMS, payments, notifications, Google Maps, and reports to real data.
4. Deploy web version.
5. Enable PWA installation.
6. Package iOS and Android app wrappers.
7. Run UAT with IDI management and board users.
8. Launch Phase 1, then continue Phase 2 and Phase 3 modules.

## Important Note

The current prototype is a front-end demonstration. For production launch, member data, payment, notification, admin audit logs, Google Maps, and investment deal data must be connected to a secure backend system.
