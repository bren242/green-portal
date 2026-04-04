// סכומי לקוח כשיר — מתעדכנים שנתית ע"י אדמין
// נשמרים ב-localStorage, fallback לברירות מחדל

export const DEFAULT_QUALIFIED_AMOUNTS = {
  amount1: '9.411',
  amount2: '1.411',
  amount3: '2.117',
  amount4: '5.882',
  amount5: '706 אלף',
  amount6: '1.058',
}

const STORAGE_KEY = 'qualifiedAmounts'

export function getQualifiedAmounts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_QUALIFIED_AMOUNTS, ...parsed }
    }
  } catch (e) {
    // ignore
  }
  return { ...DEFAULT_QUALIFIED_AMOUNTS }
}

export function saveQualifiedAmounts(amounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(amounts))
}
