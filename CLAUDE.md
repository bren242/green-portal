# GREEN Portal — Project Brief for Claude Code

## What is this?
A web portal for GREEN Wealth Management (Israel).
Used by 3 investment marketers to generate regulatory documents during client meetings.
Each module outputs a professional PDF in Hebrew (RTL) for client signature.
NO data is stored anywhere — everything is deleted when session closes.

## Portal Structure
Single entry point with client details filled ONCE per session.
Then advisor selects which modules to complete.
Each module generates a separate PDF.

### Modules
1. **KYC — אפיון צרכים** (in progress)
2. **הסכם שיווק השקעות** (future)
3. **לקוח כשיר / מסווג** (future)
4. **סיכום פגישה** (future)

### Session Flow
```
Login
  ↓
Client Details (once): name, ID, mobile, email
  ↓
Select modules to complete
  ↓
Fill each module (wizard style)
  ↓
Generate PDFs (one per module, downloaded separately)
  ↓
Session closes → everything deleted
```

---

## Stack
- React 18 + Vite
- Tailwind CSS
- jsPDF (client-side PDF generation)
- React Router
- Hosted on Vercel (static hosting only)
- RTL Hebrew throughout
- Font: Assistant (Google Fonts)

---

## Users & Auth
3 roles:
1. **admin** (Eyal only) — edit questions, manage users, update dynamic content
2. **advisor** — fill forms, generate PDFs (Eyal, Yuval, 3rd advisor)

Simple username/password. Token in memory ONLY — never localStorage.
Users: eyal (admin+advisor) / yuval (advisor) / [third] (advisor)

---

## Admin Panel
Admin can edit:
- גילוי נאות — list of investment affiliations (updated occasionally, no fixed schedule)
- סכומי לקוח כשיר/מסווג — updated annually per regulation (12M NIS / 9.3M NIS thresholds)
- User management

---

## Architecture Principles
CLIENT-SIDE ONLY. No backend. No database.
- All data lives in React state only
- Nothing sent to any server
- Vercel serves static files only
- On session close → everything gone
- no-cache / no-store headers on form pages
- autocomplete=off on all form fields
- Auto-timeout after 10 min inactivity

### Future-Ready (modular)
Code must be modular to allow future additions:
- JSON export
- CRM integration
- SSO / Phoenix group login
- Whitelabel for other advisors
- New modules added without breaking existing ones

---

## Module 1: KYC — אפיון צרכים (CURRENT FOCUS)

### Client Details (shared, filled once per session)
- שם מלא (required)
- תעודת זהות (required)
- טלפון סלולרי (required)
- דוא״ל (required)

Note: These flow automatically into all PDFs generated in the session.

### Wizard Sections
See docs/FLOW.md for complete flow.
See docs/QUESTIONS.md for risk calculator logic.
See docs/ASSETS.md for balance sheet structure.

### Refusal Mechanism
- Every question (EXCEPT personal details) has a "מסרב/ת להשיב" button
- Refusals collected and shown at bottom of PDF
- Does NOT appear on personal details section

### PDF Output
See docs/DESIGN.md for complete design system.
- Logo: public/logo.png
- RTL Hebrew, font: Assistant
- Colors: per DESIGN.md
- Separate signature blocks for single / couple

---

## Module 2: הסכם שיווק השקעות (FUTURE)
- Legal text is fixed (AS IS — legally approved)
- Dynamic fields: client details (from session) + date + advisor details
- Always paired with KYC for new clients
- Separate PDF output

---

## Module 3: לקוח כשיר / מסווג (FUTURE)
Two sub-types:
- לקוח כשיר: assets > 12M NIS
- לקוח מסווג: assets > 9.3M NIS

Thresholds updated annually by admin.
Simple questionnaire + signatures.
Separate PDF output.

---

## Module 4: סיכום פגישה (FUTURE)
Used after every meeting (new or ongoing).
Can include abbreviated KYC update.
Separate PDF output.

---

## Design
See docs/DESIGN.md for full design system.
Logo: public/logo.png
Direction: RTL (Hebrew)
Font: Assistant (Google Fonts)

## GREEN Portal PDF Template
- טמפלט מאושר: src/components/pdf/PDFTemplate.jsx
- גיבוי: src/components/pdf/PDFTemplate.BASE.jsx
- כל מודול PDF חדש חייב לייבא מ-PDFTemplate.jsx
- אסור לשנות את הטמפלט בלי אישור מפורש
- צבעים: primary #1B3A2F, gold #B8975A
- פונט: Assistant (Regular + Bold)
- RTL: תמיד row-reverse לבלוקים זה לצד זה

## Key Files
- docs/FLOW.md — KYC wizard flow (complete)
- docs/QUESTIONS.md — risk calculator questions + scoring
- docs/ASSETS.md — balance sheet asset categories
- docs/DESIGN.md — design system (colors, fonts, spacing)
- docs/TECH.md — technical architecture
