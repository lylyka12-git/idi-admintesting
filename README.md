# IDI Connect Hub - Consolidated Prototype

Open `index.html` in a modern browser to use the prototype.

## What was combined

The existing prototype already provided the strongest interactive foundation: role-based member and admin areas, a public directory, partner profiles, news, events, memberships, payment-flow demonstration, funding and pipeline workspaces, and reporting.

The proposals reinforced the product direction with Cambodia-first payments, verified identity and role controls, matching, shared discovery across the ecosystem, saved searches, calendar interoperability, notifications, and a staged delivery architecture.

This version preserves the established working flows and adds the **Smart Ecosystem Discovery** hub to the public experience. It unifies verified companies, capital/strategic partners, intelligence, and activities in one live search experience. Visitors can filter by sector, save a search locally, jump into the relevant area, export upcoming activities as an iCalendar file, and continue to a verified introduction workflow through member login.

## Platform Expansion modules (new)

Nine additional member/admin workspace pages were added under a **Platform Expansion** sidebar group, following the same pattern as the rest of the prototype (`capability-expansion.js` / `capability-expansion.css`):

- **Business Intelligence** — registration/ownership verification, risk scoring, credibility rating, document repository, historical performance tracking.
- **Investor Management** — investor profiles, onboarding status, opportunity listing, screening/approval decisions, portfolio ROI tracking.
- **Data Rooms** — per-deal document exchange with version control, permission levels, approval status, and an access activity log.
- **AI Intelligence** — nine AI-assisted functions (business evaluation, investment recommendation, risk prediction, market/financial/competitor analysis, report and executive-summary generation, opportunity scoring) plus a recent-evaluations table.
- **Financial Analysis** — statement review, ratio breakdown, cash-flow/profitability by company, and an illustrative investment-return calculator.
- **Compliance & Governance** — KYC/KYB/AML status by entity, a compliance checklist gate flow, and audit-trail dates.
- **Meetings & Video Calls** — meeting scheduling and status, plus system announcements (complements the existing Messages and Notification Center pages).
- **System Monitoring** (admin only) — service uptime/latency and recent background-job events (complements the existing Admin Staff & Roles, Approvals, and All Page Management pages).
- **Ecosystem Marketplace** — tabbed directory of opportunities, service providers, expert advisors, training/courses, and knowledge-center articles.

The existing **Reports & Analytics** page also gained two panels: investor behavior analytics and market trend reports. All of this is demo data wired into the existing `navigate()`/`loginProfiles`/`systemPageCatalog` mechanisms — nothing in `app.js` or the original pages was modified.

## Member Rewards & Redemption (new)

A tenth expansion module, `member-rewards.js` / `member-rewards.css`, adds a real (in-browser) points engine — not just static demo data:

- **Earning** — every member starts with a 100-point welcome bonus. Using a function for the first time in a session (opening the Directory, submitting a Funding Request, running an AI Intelligence report, RSVPing to an Event, etc.) posts points automatically, with VIP (1.5\u00D7) and Premium (1.25\u00D7) earning multipliers.
- **Kept on their profile** — the running balance shows as a badge in the top bar and under the member's name in the sidebar at all times, on every page.
- **Redemption** — the Member Rewards page lists partner and event vouchers (Ballangk Mall, PiNEX Pro, PiNEX Beauty, and IDI event discounts, using the real partner logos already in `assets/organization-logos/`). Redeeming deducts the points, generates a voucher code, and adds it to "My redeemed vouchers."
- Each demo login (`admin`, `vip`, `premium`, etc.) keeps its own separate wallet in `localStorage`, so switching profiles shows a different balance and history, same as the existing session-persistence pattern.

## Key prototype routes

- Public discovery: landing page, directory, partners, market intelligence, events, membership.
- Smart discovery: `#connect-hub`.
- Member and administrator demos: use the **Member login** control on the landing page; demo profiles are available in the login panel.

## Implementation note

This is a front-end prototype. Payment, messaging, matching, and verification screens demonstrate the intended user flow; they are not connected to a production API, payment gateway, notification service, or identity provider.
