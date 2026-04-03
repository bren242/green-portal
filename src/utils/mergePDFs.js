import { PDFDocument } from 'pdf-lib'

// Merge order per path
const MERGE_ORDER = {
  new_regular:    ['agreement', 'kyc', 'meeting'],
  new_qualified:  ['agreement', 'kyc', 'qualified', 'meeting'],
  existing_fund:  ['qualified', 'meeting'],
  // existing_regular: no kit — single module only
}

/**
 * Merge completed PDFs into a single kit PDF.
 * @param {Array<{moduleId, pdfBytes, fileName}>} completedPDFs
 * @param {string} path - session path (e.g. 'new_regular')
 * @param {string} clientName
 * @returns {Promise<{url: string, fileName: string, pdfBytes: ArrayBuffer}>}
 */
export async function mergeSessionPDFs(completedPDFs, path, clientName) {
  const order = MERGE_ORDER[path]
  if (!order) throw new Error('No kit merge for this path')

  const merged = await PDFDocument.create()

  for (const moduleId of order) {
    const entry = completedPDFs.find((p) => p.moduleId === moduleId)
    if (!entry) continue
    const source = await PDFDocument.load(entry.pdfBytes)
    const pages = await merged.copyPages(source, source.getPageIndices())
    pages.forEach((page) => merged.addPage(page))
  }

  const mergedBytes = await merged.save()
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`
  const safeName = (clientName || 'לקוח').replace(/\s+/g, '_')
  const fileName = `GREEN_${safeName}_${dateStr}.pdf`

  const blob = new Blob([mergedBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  return { url, fileName, pdfBytes: mergedBytes }
}

/**
 * Check if path supports full kit download.
 */
export function pathSupportsKit(path) {
  return !!MERGE_ORDER[path]
}

/**
 * Get modules needed for kit (in order).
 */
export function getKitModuleOrder(path) {
  return MERGE_ORDER[path] || []
}
