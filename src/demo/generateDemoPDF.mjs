/**
 * Generate a demo KYC PDF for visual verification.
 * Run: node --experimental-vm-modules src/demo/generateDemoPDF.mjs
 *
 * NOTE: This requires a browser environment (react-pdf/renderer).
 * Use the app UI to generate instead — open the app, fill with demo data, click generate.
 * This file documents the demo data structure for reference.
 */

console.log(`
=== KYC Demo PDF Generator ===

react-pdf/renderer requires a browser environment.
To test, open the app in the browser and use the demo data from:
  src/demo/kycDemoData.js

Or use the Vite dev server and trigger PDF generation from the UI.
`)
