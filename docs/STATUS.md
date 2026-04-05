# GREEN Portal — סטטוס פרויקט

## תאריך עדכון: 06/04/2026

## קבצים חשובים

### קבצי Session Flow
| קובץ | תפקיד |
|---|---|
| src/App.jsx | נקודת כניסה, timeout 10 דק, ניהול auth |
| src/components/auth/Login.jsx | מסך כניסה + טפסים ידניים |
| src/components/session/SessionFlow.jsx | ניהול flow הסשן: משווק → סוג → פרטים → מודולים |
| src/components/session/AdvisorSelect.jsx | בחירת משווק |
| src/components/session/ClientTypeStep.jsx | סוג לקוח (חדש/קיים, כשיר/רגיל) |
| src/components/session/ClientDetailsStep.jsx | פרטי לקוח (שם, ת.ז, טלפון, מייל) |
| src/components/session/ModuleSelection.jsx | בחירת מודולים + טפסים ידניים + הורדת קיט |

### מודולים
| קובץ | מודול |
|---|---|
| src/components/session/AgreementModule.jsx | הסכם שיווק השקעות |
| src/components/wizard/Wizard.jsx | איפיון צרכים (KYC) |
| src/components/session/MeetingSummaryModule.jsx | סיכום פגישה |
| src/components/session/QualifiedInvestorModule.jsx | הצהרת משקיע כשיר |
| src/components/session/QualifiedAdvisorModule.jsx | לקוח כשיר חוק הייעוץ |

### יצירת PDF
| קובץ | תפקיד |
|---|---|
| src/components/pdf/PDFTemplate.jsx | טמפלט בסיסי (צבעים, רכיבים משותפים) |
| src/components/pdf/generatePDF.jsx | KYC PDF |
| src/components/pdf/generateBlankPDF.jsx | KYC ידני |
| src/components/pdf/generateMarketingAgreement.jsx | הסכם שיווק (styled + blank + print) |
| src/components/pdf/generateMeetingSummary.jsx | סיכום פגישה (styled + blank) |
| src/components/pdf/generateQualifiedInvestor.jsx | הצהרת כשיר (styled + blank) |
| src/components/pdf/generateQualifiedAdvisor.jsx | כשיר חוק הייעוץ (styled + blank) |

### נתונים ואדמין
| קובץ | תפקיד |
|---|---|
| src/data/users.js | ניהול משתמשים (localStorage) |
| src/data/advisors.js | הגדרות נתיבים ומודולים |
| src/data/qualifiedAmounts.js | סכומי כשיר (localStorage, עדכון אדמין) |
| src/data/formSchema.js | סכמת שאלון KYC |
| src/utils/mergePDFs.js | מיזוג PDF לקיט |
| src/components/admin/AdminPanel.jsx | פאנל ניהול |

---

## נתיבי Flow

### לקוח חדש לא כשיר (new_regular)
login → משווק → חדש → לא כשיר → יחיד/זוג → פרטים → מודולים:
- הסכם שיווק ✅
- איפיון צרכים ✅
- סיכום פגישה ✅
- **קיט PDF**: הסכם → איפיון → סיכום

### לקוח חדש כשיר (new_qualified)
login → משווק → חדש → כשיר → יחיד/זוג → פרטים → מודולים:
- הסכם שיווק (כולל עמוד כשיר) ✅
- איפיון צרכים ✅
- הצהרת משקיע כשיר ✅
- סיכום פגישה ✅
- **קיט PDF**: הסכם → איפיון → הצהרת כשיר → סיכום

### לקוח קיים רגיל (existing_regular)
login → משווק → קיים → רגיל → פרטים → מודולים:
- סיכום פגישה ✅
- **קיט PDF**: לא נתמך (מודול בודד)

### לקוח קיים קרן השקעה (existing_fund)
login → משווק → קיים → קרן → פרטים → מודולים:
- סיכום פגישה ✅
- הצהרת משקיע כשיר ✅
- **קיט PDF**: הצהרת כשיר → סיכום

---

## סטטוס מודולים

| מודול | סטטוס | הערות |
|---|---|---|
| הסכם שיווק | ✅ עובד | styled + blank + print. טקסט משפטי AS IS. NumPara pattern לכל סעיפים ממוספרים (RTL-safe) |
| איפיון צרכים (KYC) | ✅ v2 מאושר | ויזארד מלא, סקורינג סיכון, styled + blank. ראה KYC v2 למטה |
| סיכום פגישה | ✅ עובד | styled + blank. תוקן crash של direction:rtl |
| הצהרת משקיע כשיר | ✅ עובד | styled + blank. סכומים מאדמין |
| לקוח כשיר חוק הייעוץ | ✅ עובד | styled + blank. שאלון מורחב רק כש"אחר" נבחר |

## טפסים ידניים
כל 5 הטפסים זמינים מעמוד הלוגין ומעמוד המודולים:
- איפיון צרכים ✅
- הסכם שיווק ✅
- סיכום פגישה ✅
- הצהרת כשיר ✅
- כשיר חוק הייעוץ ✅

---

## בעיות שתוקנו (QA 04/04/2026)

1. **direction: 'rtl' crash** — הוסר מ-PDFTemplate.jsx ו-generateMeetingSummary.jsx. גרם ל-bidi reorderLine crash ב-@react-pdf/renderer
2. **autocomplete** — הוסף autoComplete="off" לכל שדות AdminPanel
3. **CSS autocomplete** — הוסר כלל CSS לא-תקין (autocomplete אינו מאפיין CSS)

## בעיות שתוקנו (05/04/2026)

4. **הסכם שיווק — bidi crash מ-direction** — הוסרו כל `direction: 'rtl'`/`'ltr'` מ-generateMarketingAgreement.jsx
5. **הסכם שיווק — bold על מילים לא נכונות** — שוטחו כל Text-in-Text (nested bold) לטקסט שטוח
6. **הסכם שיווק — מספרים נדחפים לסוף שורה** — כל סעיף ממוספר (1., 2.1, 15.3, i., א.) הומר ל-NumPara pattern (View row-reverse + שני Text נפרדים)

---

## מה עובד ✅
- כל 4 נתיבי Flow
- כל 5 המודולים
- כל 5 הטפסים הידניים
- מיזוג PDF לקיט
- פאנל אדמין (משתמשים + סכומי כשיר)
- Inactivity timeout (10 דקות)
- autocomplete="off" על כל השדות
- נתוני אדמין שורדים רענון (localStorage)
- אפס נתוני לקוח ב-localStorage

## מה לא בדקנו ❌
- ביצועים תחת עומס
- תאימות דפדפנים (נבדק רק Chrome)

---

## KYC v2 — מאושר ופרודקשן ✅ (06/04/2026)

מה הושלם:
- שאלות אמריקאיות — שאלה מלאה + כל אפשרויות + סימון נבחרת (א/ב/ג/ד)
- תמונה כלכלית — פיצול לתזרים חודשי / נכסים והתחייבויות
- הוצאות שוטפות הועברו לבלוק התזרים (לא בהתחייבויות)
- מאזן חודשי עם צבע (ירוק חיובי / אדום שלילי)
- ני"ע תמיד מוצג — גם כשריק
- חתימות בדף נפרד תמיד
- עימוד — אפס חתכים באמצע נושאים (wrap={false} על כל בלוק)
- generatePDF.BASE.jsx מעודכן

### מה נשאר בפרויקט KYCGREEN:
- טופס הפניה לדסק (mailto)
- חתימות דיגיטליות (PNG + jsPDF)
- סרטון Remotion
- סבב ביקורת KYC שלישי (ממתין ליובל)

---

## מוכן לפרודקשן: כן ✅

- Build עובר ללא שגיאות
- vercel.json מוגדר עם no-cache headers
- אין נתוני לקוח ב-localStorage
- Inactivity timeout פעיל
- כל המודולים עובדים
