// Advisor signatures + company stamp
// Stored as base64 data URLs in localStorage
// Keys: signature_{userId} | companyStamp
// Note: gracefully returns null in SSR / Node.js environments where localStorage is unavailable

const _ls = typeof localStorage !== 'undefined' ? localStorage : null

// Validates a base64 data URL before passing to react-pdf <Image>
// Prevents "Incomplete or corrupt PNG file" crash on invalid/truncated data
export function isValidImageSrc(src) {
  return typeof src === 'string' &&
    src.startsWith('data:image/') &&
    src.includes('base64,') &&
    src.length > 200
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
