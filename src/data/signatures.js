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

// Re-normalizes a base64 data URL through canvas → standard 8-bit RGBA PNG
// Fixes MIME type mismatch (e.g. data:image/png but JPEG bytes) + exotic PNGs that crash react-pdf
export function normalizeImage(base64) {
  return new Promise((resolve) => {
    if (!base64 || typeof base64 !== 'string') { resolve(null); return }

    // Detect actual format from magic bytes and fix MIME type before loading.
    // Without this, browser fails to decode JPEG-data-with-PNG-header → img.onerror fires.
    let src = base64
    const idx = base64.indexOf('base64,')
    if (idx !== -1) {
      const b64 = base64.slice(idx + 7)
      if (b64.startsWith('/9j/')) {
        src = 'data:image/jpeg;base64,' + b64
        console.log('[signatures] normalizeImage: detected JPEG bytes, fixing MIME type')
      } else if (b64.startsWith('iVBOR')) {
        src = 'data:image/png;base64,' + b64
      }
    }

    const img = new window.Image()
    img.onload = () => {
      try {
        const MAX_W = 500
        const scale = img.width > MAX_W ? MAX_W / img.width : 1
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      } catch (e) {
        console.warn('[signatures] normalizeImage failed:', e)
        resolve(null)
      }
    }
    img.onerror = () => {
      console.warn('[signatures] normalizeImage img.onerror — could not load image')
      resolve(null)
    }
    img.src = src
  })
}

// Re-normalize all stored signatures + stamp — call once on admin mount
export async function normalizeAllStored() {
  if (!_ls) return
  const keys = ['signature_1', 'signature_2', 'signature_3', 'companyStamp']
  for (const key of keys) {
    const val = _ls.getItem(key)
    if (!val) continue
    const normalized = await normalizeImage(val)
    if (normalized && normalized !== val) {
      _ls.setItem(key, normalized)
      console.log(`[signatures] re-normalized ${key}`)
    }
  }
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
