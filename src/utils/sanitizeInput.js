/**
 * Removes characters that crash @react-pdf/renderer's text measurement.
 *
 * Strips:
 * - C0 control characters (U+0000 - U+001F) except tab, newline, CR
 * - C1 control characters (U+0080 - U+009F)
 * - Zero-width and bidi marks (U+200B-200F, U+202A-202E, U+2066-2069, U+FEFF)
 * - Unpaired surrogates (U+D800-DFFF)
 * - Replacement char (U+FFFD)
 *
 * Use on all text input before it reaches form state.
 */
export function sanitizeText(value) {
  if (value == null) return value
  if (typeof value !== 'string') return value

  return value
    // C0 controls except \t (9), \n (10), \r (13)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    // C1 controls
    .replace(/[\x80-\x9F]/g, '')
    // Bidi marks, zero-width, BOM
    .replace(/[​-‏‪-‮⁦-⁩﻿]/g, '')
    // Unpaired surrogates
    .replace(/[\uD800-\uDFFF]/g, '')
    // Replacement char
    .replace(/�/g, '')
    // Normalize multiple spaces (optional but cleaner)
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Recursively sanitize all string values in an object/array.
 * Use right before passing data to PDF generation.
 */
export function sanitizeFormData(data) {
  if (data == null) return data
  if (typeof data === 'string') return sanitizeText(data)
  if (Array.isArray(data)) return data.map(sanitizeFormData)
  if (typeof data === 'object') {
    const result = {}
    for (const key of Object.keys(data)) {
      result[key] = sanitizeFormData(data[key])
    }
    return result
  }
  return data
}