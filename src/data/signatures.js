// Advisor signatures + company stamp
// Stored as base64 data URLs in localStorage
// Keys: signature_{userId} | companyStamp
// Note: gracefully returns null in SSR / Node.js environments where localStorage is unavailable

const _ls = typeof localStorage !== 'undefined' ? localStorage : null

// Validates a base64 data URL before passing to react-pdf <Image>
// Checks actual image magic bytes — not just string format
// PNG base64 always starts with "iVBOR", JPEG with "/9j/"
export function isValidImageSrc(src) {
  if (!src || typeof src !== 'string') return false
  const idx = src.indexOf('base64,')
  if (idx === -1) return false
  const b64 = src.slice(idx + 7)
  if (b64.length < 100) return false
  return b64.startsWith('iVBOR') || b64.startsWith('/9j/')
}

export function getSignature(userId) {
  const val = _ls ? _ls.getItem(`signature_${userId}`) || null : null
  console.log(`[signatures] getSignature(${userId}) →`, val ? `${val.length} chars` : 'null')
  return val
}

export function saveSignature(userId, base64) {
  if (_ls) _ls.setItem(`signature_${userId}`, base64)
}

export function deleteSignature(userId) {
  if (_ls) _ls.removeItem(`signature_${userId}`)
}

export function getCompanyStamp() {
  return _ls ? _ls.getItem('companyStamp') || null : null
}

export function saveCompanyStamp(base64) {
  if (_ls) _ls.setItem('companyStamp', base64)
}

export function deleteCompanyStamp() {
  if (_ls) _ls.removeItem('companyStamp')
}
