import { Suspense, lazy } from 'react'

interface ScannerProps {
  onScan: (decoded: string, format: string) => void
}

const LazyHtml5QrcodeScanner = lazy(() => import('./Html5QrcodeScanner'))

function Scanner({ onScan }: ScannerProps) {
  return (
    <Suspense fallback={
      <div className="scanner-loading">
        <div className="scanner-loading-spinner" />
        <p className="scanner-loading-text">Initializing camera...</p>
      </div>
    }>
      <LazyHtml5QrcodeScanner onScan={onScan} />
    </Suspense>
  )
}

export default Scanner
