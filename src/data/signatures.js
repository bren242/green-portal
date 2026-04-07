// Advisor signatures + company stamp
// Stored as base64 data URLs in localStorage
// Keys: signature_{userId} | companyStamp

export function getSignature(userId) {
  return localStorage.getItem(`signature_${userId}`) || null
}

export function saveSignature(userId, base64) {
  localStorage.setItem(`signature_${userId}`, base64)
}

export function deleteSignature(userId) {
  localStorage.removeItem(`signature_${userId}`)
}

export function getCompanyStamp() {
  return localStorage.getItem('companyStamp') || null
}

export function saveCompanyStamp(base64) {
  localStorage.setItem('companyStamp', base64)
}

export function deleteCompanyStamp() {
  localStorage.removeItem('companyStamp')
}
