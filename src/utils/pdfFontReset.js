// SECURITY NOTE: This utility only touches font cache internals
// (TTF data + load promises). It does NOT access, log, transmit, or
// persist any form data, client data, or PII. No network calls.

import { Font } from '@react-pdf/renderer'

/**
 * Full font cache reset for @react-pdf/renderer v4.3.2.
 *
 * Font.reset() in v4.3.2 only clears `data` but leaves `loadResultPromise`
 * intact. On the second pdf().toBlob() call this causes load() to return
 * the stale promise, _load() never runs, data stays null, and textkit
 * crashes on null.unitsPerEm.
 *
 * This function clears both fields on every registered font source.
 * Must be called before every pdf().toBlob() call.
 *
 * Do NOT replace with Font.clear() — that wipes Helvetica/Courier/Times
 * and breaks default font fallback.
 */
export function resetPdfFontCache() {
  const families = Font.getRegisteredFonts()
  for (const family of Object.values(families)) {
    if (!family?.sources) continue
    for (const source of family.sources) {
      source.data = null
      source.loadResultPromise = null
    }
  }
}
