## CRITICAL — Lessons from 27.05.2026 emergency session

### Font.reset() is broken in @react-pdf/renderer v4.3.2
- Symptom: TypeError unitsPerEm on 2nd pdf().toBlob() call
- Cause: Font.reset() only clears `data`, not `loadResultPromise`
- Fix: Use resetPdfFontCache() from src/utils/pdfFontReset.js
- NEVER replace with Font.clear() (wipes Helvetica)
- NEVER revert pdfFontReset.js without understanding the original bug

### Input sanitization is required for PDF rendering
- Word/Outlook paste injects invisible control chars that crash textkit
- All PDF generators must sanitizeFormData() before pdf().toBlob()
- Defined in src/utils/sanitizeInput.js

### PDF preview pattern: inline iframe, not modal overlay
- PDFPreview modal (fixed inset-0 z-50) blocks continue buttons
- Result: onSavePDF never called, PDFs not added to kit
- Use inline iframe + visible buttons, matching AgreementModule pattern

### Kit threshold: 2 modules minimum, not all
- MERGE_ORDER lists optimal order but should not gate kit availability
- kitReady = completedKitCount >= 2 (was: kitModules.every(...))

### Process lessons
- ALWAYS read code before suggesting fixes — never guess from reports
- One prompt → one response → verify → next prompt (no batching)
- PDF visual confirmation on production before declaring "fixed"
- When user says "the same crash" — verify build hash actually changed
