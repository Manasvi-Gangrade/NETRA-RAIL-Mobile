# NETRA Companion

bhai sun na how are you I need your help, i want you to be with me through this project and build everything, THE BRIEF

Build NETRA-RAIL MOBILE, the official companion app for NETRA-RAIL — India's autonomous multi-agent railway intelligence platform (National Enterprise Traffic, Routing & Autonomous Rail-Grid). This is a role-adaptive mobile web app with FOUR distinct logins — Passenger, Freight & Logistics Coordinator, Station Master / Traffic Controller, and Trackman / Maintenance Crew — each unlocking a completely different dashboard, but all sharing one consistent design system.

This app is the human-facing counterpart to our already-deployed web command center (netra-rail.vercel.app), which has a dark, cinematic, futuristic-AI-ops aesthetic — live stats, glowing accent lines, hero video, flywheel visualizations. Carry that same DNA into this app — but because this app will be used by everyday citizens, port officials, station masters and field workers (not just engineers), blend it with the trust, gravity, and structure of an official Government of India digital service (think DigiLocker, UMANG, IRCTC, Aadhaar apps) — clean official headers, verified badges, tricolour accent restraint, formal typography, seals of authenticity — but rendered in a premium, modern, animation-rich way, NOT a clunky old government portal.

The result should feel like: "what if ISRO/DRDO built a beautiful, cinematic control app for a national rail AI system." Serious, official, trustworthy — but alive, animated, and futuristic.

1. VISUAL IDENTITY & DESIGN LANGUAGE

Overall mood: Dark-mode-first "mission control" base layer (matching the deployed web command center) with light, official "citizen service" surfaces layered on top for passenger-facing screens. Think: NASA JPL mission control meets Digital India portal meets a premium fintech app.

Color system:

Primary background: deep navy-charcoal (#0B1220 to #0F1A2B gradient), not pure black — should feel like a night-time control room

Accent primary: electric blue (#2E75B6 → #4FC3F7 glow gradient) — used for active states, live data, pulsing indicators

Accent secondary (official/trust layer): deep saffron (#FF9933) and India-flag green (#138808) used SPARINGLY as thin accent lines, verified badges, and status chips — never as large fills, to keep it tasteful and official rather than loud

Success/live: emerald green with soft glow

Warning/slow-zone: amber with pulsing animation

Critical/alert: signal red with sharp pulse

Card surfaces: frosted glass / subtle glassmorphism panels (rgba(255,255,255,0.04) with backdrop-blur) floating on the navy background, thin 1px glowing borders

Light-mode override for passenger onboarding/KYC-style screens: white/off-white with navy header bar, mimicking official govt-portal trust cues

Typography:

Headlines: a strong, geometric sans (e.g., "Space Grotesk" or "Sora") for that futuristic-control-room feel

Body/UI text: highly legible sans (e.g., "Inter" or "Noto Sans" — Noto Sans specifically because it must render Devanagari, Tamil, Bengali, Gujarati, Odia, Telugu, Kannada, Urdu scripts cleanly for the 230+ language layer)

Numbers/data (ETAs, coordinates, IDs): tabular/monospace accent font for that "live telemetry" feel

Official government texture (use tastefully, not kitschy):

Top status bar on every screen: thin tricolour hairline (saffron–white–green, 2px) directly under the status bar, like an official seal of the app

A small "Ministry of Railways · Government of India Initiative" micro-label in the splash/login screen footer

"Verified" / "Government Certified Data Source" badges (small shield-check icon) next to live data feeds, to build public trust

Official-feeling formal language in headers ("NETRA-RAIL National Rail Intelligence Network") paired with modern conversational microcopy in body text

Emblem-style circular badge/logo mark for NETRA-RAIL (an eye/radar motif — "Netra" means "eye") used as a loading spinner and splash icon

2. ANIMATION & MOTION LANGUAGE — GO ALL OUT HERE

This is the single most important differentiator. Every screen should feel alive, like it's plugged into a real-time national network:

Splash/Boot sequence: app opens with a radar-sweep animation on the NETRA-RAIL eye/emblem, concentric pulse rings expanding outward, then resolves into the login screen — like a system "coming online"

Live pulse indicators: every live-data card has a subtle animated glowing dot/heartbeat pulse (like a "LIVE" badge breathing)

Number count-up animations: stats (delay minutes, km monitored, trains active, demurrage saved) animate counting up from 0 on screen load

Route/map line-draw animation: train routes and corridor lines animate drawing themselves in on map screens, like a signal tracing across the network

Card entrance animations: staggered fade+slide-up entrance for dashboard cards (100ms stagger between cards)

Micro-interactions on every tap: buttons have a soft scale-down + glow-ripple on press; toggles (like "Contribute to Track Safety") have a satisfying animated switch with a particle-burst micro-celebration on activation

Flywheel Pulse Widget (shared across all roles): a small circular widget showing 4 nodes (Pillar A/B/C/D) connected by animated flowing dashed lines, with light "packets" continuously traveling around the loop — always animating in the background of the home dashboard, reinforcing "you're part of a living system"

Slow-zone/alert animations: when a safety alert fires, use a soft radar-ping animation expanding from the affected map point, plus a gentle haptic-style visual shake on the alert card

Language switch transition: smooth crossfade + slight vertical slide when switching languages, never a jarring reload

Skeleton loaders, not spinners: wherever data loads, use shimmering skeleton placeholders shaped like the final content

Page transitions: slide + fade between screens, with role-dashboards using a subtle "system re-configuring" transition (brief scan-line wipe effect) when a user first logs into their role — selling the "app is adapting itself to you" concept

3. APP STRUCTURE

Screen 1 — Splash & Boot

Radar-sweep animation on NETRA-RAIL emblem → tricolour hairline reveal → tagline animates in: "India's Autonomous Rail Intelligence — Now in Your Pocket."

Screen 2 — Unified Login Gateway

Official, DigiLocker-style card-based login on light/navy split-screen background. Four large role-selector cards animate in with icons:

🧑‍🤝‍🧑 Passenger — "Track your journey, protect the network"

🚢 Freight & Logistics Coordinator — "Port-to-plant dispatch, live"

🚦 Station Master / Traffic Controller — "Precedence, explained in real time"

🛠️ Trackman / Maintenance Crew — "Verified work orders, in the field"

Each card, on tap, morphs/expands into its respective auth flow (OTP for passenger; employee-ID + biometric/PIN for staff roles) with a smooth shared-element transition. Include a language selector globe icon top-right (230+ languages) available even before login.

Screen 3 — Role-Adaptive Home Dashboard

After login, a brief "Configuring your NETRA-RAIL experience..." animated loading state (system re-configuring transition), then the role-specific home renders.

4. ROLE DASHBOARDS — BUILD EACH ONE IN FULL DESCRIPTIVE DEPTH

🧑‍🤝‍🧑 PASSENGER DASHBOARD

Hero card: current/next journey with animated live train-position marker moving along a route line, ETA with live countdown

Big animated toggle: "Contribute to Track Safety" — when switched on, show a subtle animated waveform icon (representing live IMU streaming) pulsing quietly, plus a reassuring micro-copy: "Your phone is helping protect 68,000 km of track. Anonymously. Always your choice."

"Track Guardian Score" widget: circular progress ring that fills with an animated count-up, showing km monitored this month, with a small badge/level system (Bronze/Silver/Gold Guardian) — gamified, celebratory confetti-burst animation on leveling up

"Why is my train delayed?" explainer card — expands with a smooth accordion animation to show plain-language reasoning + a live drone-inspection countdown if relevant

Nearby alerts map — animated pin-drop for slow zones near the route

Floating multilingual voice assistant button (mic icon with breathing glow) — bottom right, always accessible

Bottom nav: Home / My Journeys / Track Guardian / Alerts / Profile

🚢 FREIGHT & LOGISTICS COORDINATOR DASHBOARD

Top stat strip with count-up animated numbers: Vessels Docked Today, Wagons Dispatched, Demurrage Risk (₹), Active Corridors

Live vessel ETA feed — vertical timeline with animated progress dots moving along it as time passes

Demurrage-risk meter — animated circular gauge (green→amber→red) with a needle-sweep animation on load

Dispatch queue cards with Approve / Override buttons — override triggers a modal requiring a reason (dropdown + text), with a satisfying confirm-animation (checkmark draw-in)

Multi-port switcher — horizontal scrollable pill-tabs with an animated underline indicator sliding between them

Natural-language query bar at top ("Ask about any corridor...") with animated placeholder text cycling through example queries in different languages

🚦 STATION MASTER / TRAFFIC CONTROLLER DASHBOARD

Full-width live precedence feed — a horizontally scrolling animated "track" visual showing train icons (colour-coded by speed class) with the AI's held/passed decision animating in real time, each with a small "why" tooltip that expands on tap

Slow-zone alert banner — appears with a sharp slide-down + amber pulse animation when Pillar C/D flags something, showing live drone-inspection ETA counting down

Large, unmistakable "TAKE MANUAL CONTROL" override button — bold, high-contrast, satisfying press animation, because this is the single most safety-critical action in the app

Section throughput chart — animated bar/line chart that draws itself in on load

Voice-command large mic button optimized for control-room hands-busy use

🛠️ TRACKMAN / MAINTENANCE CREW DASHBOARD

High-contrast, large-touch-target layout (outdoor sunlight readability, glove-friendly)

Incoming work-order cards — each with drone-captured inspection thumbnail image, GPS coordinate, defect classification badge, and a large "Navigate" button (opens offline-capable map with animated route-draw)

QR/laser-marker "Scan to Confirm" button — opens camera view with an animated scanning-frame overlay

Big "Mark Resolved" button — on tap, triggers a satisfying full-screen success animation (checkmark burst + "Slow-zone lifting..." live status), visually closing the loop

SOS/Hazard-report floating button — pulsing red, always visible, for immediate escalation

Offline indicator — subtle badge showing "Cached · Will sync when online" with animated sync icon when connectivity returns

5. SHARED COMPONENTS (across all roles)

Flywheel Pulse Widget — always present on home dashboard (see animation section above)

Notification Center — priority-tiered (Safety-Critical / Operational / Informational), each tier with distinct color coding and entrance animation

Language & Voice Switcher — accessible from every screen header, 230+ languages, smooth transition on switch

Privacy & Consent Center — official-feeling settings page (light mode, govt-portal styling) where users can view/pause/delete their contributed data, with clear toggle animations

Profile/Identity Card — styled like an official digital ID card (DigiLocker-esque), with role badge, verification checkmark, and subtle holographic shimmer animation on the card edge

6. CONTENT & TONE GUIDELINES

Headers: formal, official, national-infrastructure tone ("NETRA-RAIL National Rail Intelligence Network," "Government-Verified Safety Data")

Body/microcopy: warm, clear, human — explain AI decisions in plain language, never jargon

Always pair automation with explainability: no action should ever feel like a "black box" — show the "why" everywhere

Use real Indian rail geography and corridor names (Mundra, JNPT, Vishakhapatnam, Golden Quadrilateral, Vadodara–Surat, JNPT–Tata Steel) for authenticity in mock data

7. DATA / BUILD NOTES

This is a hackathon prototype — use realistic mock/simulated live data (animated counters, fake but plausible train IDs, coordinates, ETAs) rather than real APIs

Structure mock data so it's easy to swap for real endpoints later (clean data layer, not hardcoded inline)

Prioritize building the Passenger and Station Master dashboards first in full animated depth (these best tell the core story), then Freight Coordinator and Trackman

Make it fully responsive but mobile-first — this is a phone app experience, optimize all animations and layouts for a 375–430px viewport primarily

Build this as a visually stunning, animation-rich, official-feeling national infrastructure app — something that would make a room of hackathon judges go quiet for a second before they start clapping., this is an assistive application to the original deployed project, isko refer kar lena and code wali cheeze bhi kar lena refer is repo se https://netra-rail.vercel.app/, https://github.com/Manasvi-Gangrade/NETRA-RAIL, bohot accha bohot sundar and same theme pr banana bhai please please please I trust you onto this and graphs, charts and sab kuch bohot acche acche diagrams and all daalna and bhaiii banana web hi but mobile responsive.

## Development & Local Execution

Prefer working locally? You need Node.js and npm:

```sh
git clone https://github.com/Manasvi-Gangrade/NETRA-RAIL-Mobile.git
cd NETRA-RAIL-Mobile
npm i
npm run dev
```
