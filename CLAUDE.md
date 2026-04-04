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
1. **KYC — אפיון צרכים** ✅
2. **הסכם שיווק השקעות** ✅
3. **הצהרת משקיע כשיר** ✅
4. **לקוח כשיר — חוק הייעוץ** ✅
5. **סיכום פגישה** ✅

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
- `generateBlankPDF.jsx` — טופס ידני להדפסה ✅ מאושר ומוכן
- גיבוי: `generateBlankPDF.BASE.jsx`

---

## Module 2: הסכם שיווק השקעות ✅
- `generateMarketingAgreement.jsx` — גרסת הדפסה + גרסת ממשק
- Legal text is fixed (AS IS — legally approved)
- Dynamic fields: client details (from session) + date + advisor details
- Always paired with KYC for new clients
- Separate PDF output
- `generateMarketingAgreement(clientData)` — print version (B&W)
- `generateMarketingAgreementStyled(clientData)` — styled version (GREEN colors + auto dates)
- `generateMarketingAgreementBlank()` — blank manual fill version (B&W, no client data)
- All 3 versions live in `generateMarketingAgreement.jsx` ✅ מאושר
- גיבוי: `generateMarketingAgreement.BASE.jsx`
- טקסט משפטי = AS IS, אסור לשנות מילה

---

## Module 3: הצהרת משקיע כשיר ✅
- `generateQualifiedInvestor.jsx` — styled + blank
- סכומים מתעדכנים דרך אדמין (localStorage)
- ברירת מחדל: כשיר 12M, מסווג 9.3M
- גיבוי: אין (לא נדרש)

---

## Module 4: לקוח כשיר — חוק הייעוץ ✅
- `generateQualifiedAdvisor.jsx` — styled + blank
- 4 עמודים (עמודים 3-4 מותנים בבחירת "אחר")
- שאלון מורחב רק אם נבחר "אחר" בתנאי 2
- סכום מאדמין (amount_advisor)
- גיבוי: אין

---

## Module 5: סיכום פגישה ✅
- `generateMeetingSummary.jsx` — styled + blank
- Used after every meeting (new or ongoing)
- גיבוי: אין

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

## חוקי טפסים
- גרסת הדפסה = שחור-לבן, קווים נקיים, ללא רקעים
- גרסת ממשק = צבעי GREEN מלאים (ירוק #1B3A2F, זהב #B8975A) + תאריכים אוטומטיים
- פורמט תאריך אוטומטי = DD/MM/YYYY מ-new Date()
- טקסט משפטי = AS IS, אסור לשנות מילה
- **CRITICAL**: אסור להשתמש ב-`direction: 'rtl'` או `direction: 'ltr'` ב-style של @react-pdf/renderer — גורם ל-bidi reorderLine crash. במקום זה: `textAlign: 'right'` / `textAlign: 'left'`
- **CRITICAL**: מספרים כמו (1), (2), 1., 2.1 בטקסט עברי עוברים bidi reorder — יש לשים אותם בעמודה נפרדת (NumPara pattern: `<View style={{flexDirection:'row-reverse'}}>` עם שני `<Text>` נפרדים — אחד למספר ואחד לטקסט)
- **CRITICAL**: אסור לקנן `<Text>` בתוך `<Text>` עם סגנון שונה (למשל bold) — גורם ל-bidi למקם את הסגנון על תווים לא נכונים. כל Text חייב להיות שטוח (flat)

## Key Files
- docs/FLOW.md — KYC wizard flow (complete)
- docs/QUESTIONS.md — risk calculator questions + scoring
- docs/ASSETS.md — balance sheet asset categories
- docs/DESIGN.md — design system (colors, fonts, spacing)
- docs/TECH.md — technical architecture
- docs/STATUS.md — סטטוס פרויקט מלא (QA 04/04/2026)
