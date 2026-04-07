# GREEN Portal — SPEC

## מטרת הפרויקט

פורטל וב לחברת GREEN Wealth Management (פמילי אופיס, תל אביב).
משמש 3 משווקי השקעות להפקת מסמכים רגולטוריים בעברית (RTL) במהלך פגישות עם לקוחות.
כל מודול מפיק PDF מקצועי לחתימת הלקוח.

**עקרון מרכזי**: אפס שמירת נתוני לקוח — הכל נמחק בסיום הסשן.

---

## סטאק טכני

| רכיב | טכנולוגיה |
|---|---|
| Framework | React 18 + Vite |
| עיצוב | Tailwind CSS 3.4 |
| הפקת PDF | @react-pdf/renderer 4.3.2, pdf-lib 1.17.1 (מיזוג) |
| ניתוב | React Router DOM 6.28 |
| אירוח | Vercel — static בלבד, ללא backend |
| פונט | Assistant (Google Fonts) |
| אימות | username/password בזיכרון בלבד |

### תלויות מיוחדות
- `buffer` — polyfill ל-@react-pdf/renderer (Vite browser)
- `jsPDF` — לא בשימוש פעיל (legacy)

---

## מבנה הפרויקט

```
src/
├── App.jsx                    — entry, timeout 10 דק, auth
├── main.jsx                   — Buffer polyfill
├── components/
│   ├── auth/Login.jsx         — מסך כניסה
│   ├── admin/AdminPanel.jsx   — ניהול משתמשים + סכומים
│   ├── session/
│   │   ├── SessionFlow.jsx        — אורקסטרציה ראשית
│   │   ├── AdvisorSelect.jsx      — שלב 1: בחירת משווק
│   │   ├── ClientTypeStep.jsx     — שלב 2: סוג לקוח
│   │   ├── ClientDetailsStep.jsx  — שלב 3: פרטי לקוח
│   │   ├── ModuleSelection.jsx    — שלב 4: בחירת מודולים
│   │   ├── AgreementModule.jsx
│   │   ├── QualifiedInvestorModule.jsx
│   │   ├── QualifiedAdvisorModule.jsx
│   │   └── MeetingSummaryModule.jsx
│   ├── wizard/
│   │   ├── Wizard.jsx             — ויזארד KYC (6 חלקים)
│   │   └── WizardHeader.jsx
│   └── pdf/
│       ├── PDFTemplate.jsx            — טמפלט בסיס (אסור לשנות!)
│       ├── generatePDF.jsx            — KYC PDF
│       ├── generateBlankPDF.jsx       — KYC ידני
│       ├── generateMarketingAgreement.jsx  — הסכם (3 גרסאות)
│       ├── generateQualifiedInvestor.jsx
│       ├── generateQualifiedAdvisor.jsx
│       └── generateMeetingSummary.jsx
├── data/
│   ├── users.js               — משתמשים (localStorage)
│   ├── advisors.js            — נתיבים, מודולים, טפסים ידניים
│   ├── qualifiedAmounts.js    — סכומי כשיר (localStorage)
│   └── formSchema.js          — סכמת שאלון KYC
├── utils/
│   └── mergePDFs.js           — מיזוג PDF לקיט
└── assets/
    └── logoBase64.js          — לוגו כ-base64
```

---

## Flow — מסלול המשתמש

```
Login → בחירת משווק → סוג לקוח → פרטי לקוח → מודולים → הפקת PDF → סיום סשן
```

### 4 נתיבים

| נתיב | מודולים | קיט PDF |
|---|---|---|
| חדש רגיל | הסכם + KYC + סיכום פגישה | הסכם → KYC → סיכום |
| חדש כשיר | הסכם + KYC + הצהרת כשיר + סיכום | הסכם → KYC → כשיר → סיכום |
| קיים רגיל | סיכום פגישה | ללא קיט |
| קיים קרן | סיכום + הצהרת כשיר | כשיר → סיכום |

---

## 5 מודולים — מה עובד

### 1. הסכם שיווק השקעות — עובד
- טקסט משפטי AS IS (אסור לשנות מילה)
- 3 גרסאות בקובץ אחד: styled, print, blank
- גיבוי: `generateMarketingAgreement.BASE.jsx`

### 2. איפיון צרכים (KYC) — עובד (v3)
- ויזארד 6 חלקים: פרטים אישיים → תמונה כלכלית → מטרות → הערכת סיכון → שאלות סיכון → סיכום משווק
- מנגנון סירוב ("מסרב/ת להשיב") על כל שאלה
- חישוב סיכון אוטומטי: A=1, B=2, C=3, D=5, ממוצע → רמת סיכון
- התראת פער: אם הפרש ≥2 בין שתי תשובות
- גיבוי: `generatePDF.BASE.jsx`, `generateBlankPDF.BASE.jsx`

### 3. הצהרת משקיע כשיר — עובד
- סכומים דינמיים מאדמין (localStorage)
- 3 תנאי כשירות לבחירה
- styled + blank

### 4. לקוח כשיר — חוק הייעוץ — עובד
- 4 עמודים (3-4 מותנים בבחירת "אחר")
- סכום מאדמין (amount_advisor)
- styled + blank

### 5. סיכום פגישה — עובד
- סיבת פגישה, אופן, יוזם, משך
- טבלת נושאים (כן/לא) — 5 חובה + "אחר" אופציונלי
- סיכום, המלצה, החלטה, משימות
- ולידציה לפני הפקה
- styled + blank

### טפסים ידניים
כל 5 הטפסים זמינים להורדה ידנית (שחור-לבן, ללא נתוני לקוח) מדף הלוגין ומדף המודולים.

---

## מה לא עובד / מוגבל

| נושא | סטטוס |
|---|---|
| תאימות דפדפנים | נבדק רק Chrome |
| ביצועים תחת עומס | לא נבדק |
| Responsive — מובייל | חלקי (Tailwind responsive אבל לא נבדק לעומק) |
| חתימות דיגיטליות | לא מיושם (PNG + jsPDF — תוכנן לעתיד) |
| טופס הפניה לדסק | לא מיושם (mailto — תוכנן) |
| גילוי נאות באדמין | לא מיושם (רשימת זיקות — תוכנן) |

---

## הצעד הבא

לפי STATUS.md:
- סבב ביקורת KYC שלישי (ממתין ליובל)
- טופס הפניה לדסק (mailto)
- חתימות דיגיטליות (PNG)

---

## החלטות עיצוביות חשובות

### 1. Client-side only — אפס backend
כל הפקת ה-PDF ב-browser. אין שרת, אין DB, אין API.
נתוני לקוח בזיכרון React בלבד — נמחקים בסגירת סשן.
**חריג יחיד**: הגדרות אדמין (משתמשים + סכומי כשיר) ב-localStorage.

### 2. RTL — כללים קריטיים ל-@react-pdf/renderer
- **אסור** `direction: 'rtl'` — גורם ל-bidi reorderLine crash
- **במקום**: `textAlign: 'right'` / `textAlign: 'left'`
- **מספרים בעברית** (1., 2.1, א., ב.): NumPara pattern —
  `<View style={{flexDirection:'row-reverse'}}>` עם שני `<Text>` נפרדים
- **אסור** `<Text>` בתוך `<Text>` עם סגנון שונה — bidi שם bold על תווים לא נכונים
- כל Text חייב להיות שטוח (flat)
- `wrap={false}` על בלוקים גדולים למניעת שבירת עמוד באמצע

### 3. PDFTemplate.jsx — טמפלט בסיס משותף
כל מודול PDF חייב לייבא ממנו. אסור לשנות ללא אישור מפורש.
גיבוי: `PDFTemplate.BASE.jsx`

### 4. צבעים

| שם | ערך | שימוש |
|---|---|---|
| primary | `#1B3A2F` | ירוק כהה — כותרות, header |
| secondary | `#3E7A5C` | ירוק בינוני |
| gold | `#B8975A` | זהב — הדגשות, קווים |
| goldLight | `#D4B483` | זהב בהיר |
| surface | `#F6F5F1` | רקע כרטיסים |
| border | `#DDD5BF` | גבולות |
| black | `#1A1A1A` | טקסט ראשי |
| muted | `#5A5A5A` | טקסט משני |
| negative | `#C0392B` | אדום — אזהרות |

### 5. אבטחה ופרטיות
- אימות: token בזיכרון בלבד (לא localStorage)
- timeout: 10 דקות חוסר פעילות → logout אוטומטי
- `autocomplete="off"` על כל השדות
- `no-cache` headers ב-Vercel
- אפס שליחת נתונים לשרת

### 6. גרסאות PDF
כל מודול תומך ב-2 גרסאות:
- **Styled**: צבעי GREEN, נתוני לקוח מלאים, תאריך אוטומטי (DD/MM/YYYY)
- **Blank**: שחור-לבן, קווים נקיים, למילוי ידני

### 7. מיזוג לקיט
`mergePDFs.js` — מאחד את כל ה-PDFs של הסשן לקובץ אחד לפי סדר קבוע (`MERGE_ORDER[path]`).
שם קובץ: `GREEN_[שם]_[תאריך].pdf`

### 8. מבנה מודולרי
כל מודול עצמאי: קומפוננטת UI + מחולל PDF + export functions.
הוספת מודול חדש = קובץ UI + קובץ PDF + הגדרה ב-advisors.js.

---

## משתמשים

| username | שם | תפקיד | סיסמה |
|---|---|---|---|
| eyal | אייל ברנר | admin + advisor | green2026 |
| yuval | יובל לרר | advisor | green2026 |
| yuval_koren | יובל קורן | advisor | green2026 |

אדמין יכול: ניהול משתמשים, עדכון סכומי כשיר, טבלת ניקוד, שאלות סיכון.

---

## סכומי כשיר (ברירת מחדל)

| שדה | ערך | שימוש |
|---|---|---|
| amount1 | 9.411 | נכסים נזילים — הצהרת כשיר |
| amount2 | 1.411 | הכנסה שנתית |
| amount3 | 2.117 | תא משפחתי |
| amount4 | 5.882 | נכסים נזילים (תנאי 3) |
| amount5 | 706 אלף | הכנסה שנתית (תנאי 3) |
| amount6 | 1.058 | תא משפחתי (תנאי 3) |
| amount_advisor | 12 | כשיר חוק הייעוץ |

מתעדכנים שנתית דרך אדמין.

---

## תיעוד נוסף

| קובץ | תוכן |
|---|---|
| CLAUDE.md | הנחיות לפיתוח |
| docs/STATUS.md | סטטוס מלא + היסטוריית תיקונים |
| docs/FLOW.md | Flow ויזארד KYC מפורט |
| docs/QUESTIONS.md | שאלות סיכון + ניקוד |
| docs/ASSETS.md | קטגוריות מאזן |
| docs/DESIGN.md | מערכת עיצוב (צבעים, פונטים, ריווח) |
| docs/TECH.md | ארכיטקטורה טכנית |
