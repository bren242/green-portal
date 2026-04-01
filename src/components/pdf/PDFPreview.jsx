import { useState, useEffect } from 'react'

export default function PDFPreview({ pdfUrl, fileName, onClose, onDownload }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-card w-[95vw] h-[92vh] max-w-5xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-light">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-text-muted hover:text-green-primary transition-colors text-xl leading-none"
              title="סגור"
            >
              &times;
            </button>
            <span className="text-sm font-semibold text-green-primary">{fileName}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="px-5 py-2 bg-green-primary text-white font-bold rounded-lg hover:bg-green-secondary transition-colors text-sm"
            >
              הורד PDF
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-200 overflow-auto">
          {isMobile ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
              <div className="text-5xl">📄</div>
              <p className="text-text-primary font-semibold">
                תצוגה מקדימה לא זמינה במכשיר נייד
              </p>
              <p className="text-text-muted text-sm">
                לחץ "הורד PDF" כדי לפתוח את המסמך
              </p>
              <button
                onClick={onDownload}
                className="px-8 py-3 bg-green-primary text-white font-bold rounded-lg hover:bg-green-secondary transition-colors"
              >
                הורד PDF
              </button>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  )
}
