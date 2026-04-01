# GREEN KYC ג€” Project Brief for Claude Code

## What is this?
A web app for GREEN Wealth Management (Israel).
Used by 3 investment marketers to fill out client needs assessment (KYC) during meetings.
Outputs a professional PDF in Hebrew (RTL) for client signature.

## Stack
- React 18 + Vite
- Tailwind CSS
- jsPDF (client-side PDF generation)
- React Router (wizard navigation)
- Hosted on Vercel (static hosting only)
- RTL Hebrew throughout

## Users
3 roles:
1. admin (Eyal only) ג€” can edit questions, logic, users
2. advisor ג€” fills questionnaire, generates PDF (Eyal, Yuval, 3rd advisor)
3. No client-facing login ג€” client signs via external signature tool

## Auth
Simple username/password (hardcoded or .env).
Purpose: prevent random access only.
Users: eyal / yuval / [third advisor]
Simple JWT or session token in memory only (NOT localStorage).

## Core Flow
Wizard-style (one section per screen), RTL, responsive (desktop + tablet + mobile).
Sections:
1. Gate: single signer or couple?
2. Personal details (1 or 2 clients)
3. Financial balance sheet
4. Investment goals & horizon
5. Liquidity needs
6. Risk calculator (4 questions ג†’ score 1-5)
7. Advisor summary (advisor only, not shown to client)

## Output
Single PDF downloaded to browser.
NO data stored anywhere after download.
NO JSON output in this phase.
Architecture is modular and ready for future CRM/JSON integration.

## Architecture
CLIENT-SIDE ONLY. No backend. No database.
All data lives in React state only.
Vercel serves static files only ג€” never touches client data.
On session close ג†’ everything is gone.

## Security
- HTTPS (automatic on Vercel)
- No data sent to any server
- no-cache / no-store headers on form pages
- autocomplete=off on all form fields
- Auto-timeout after 10 min inactivity

## Design
See docs/DESIGN.md for full design system.
Logo: public/logo.png
Font: Assistant (Google Fonts)
Direction: RTL (Hebrew)

## Key Files
- docs/FLOW.md ג€” complete wizard flow
- docs/QUESTIONS.md ג€” all questions + scoring logic
- docs/ASSETS.md ג€” asset categories structure
- docs/DESIGN.md ג€” design system
- docs/TECH.md ג€” technical architecture

