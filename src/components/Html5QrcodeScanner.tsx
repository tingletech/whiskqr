import { useEffect, useRef } from 'react'
import { Html5QrcodeScanner as Html5QrcodeScannerLib } from 'html5-qrcode'

interface Props {
  onScan: (decoded: string, format: string) => void
}

function Html5QrcodeScannerComponent({ onScan }: Props) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const scannerInstanceRef = useRef<Html5QrcodeScannerLib | null>(null)

  useEffect(() => {
    if (!scannerRef.current) return

    const scanner = new Html5QrcodeScannerLib(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        disableFlip: false,
        showTorchButtonIfSupported: true
      },
      false
    )

    scannerInstanceRef.current = scanner

    scanner.render(
      (decodedText, result) => {
        const formatName = result?.result?.format?.formatName || 'Unknown'
        onScan(decodedText, formatName)
      },
      (_error) => {}
    )

    return () => {
      scanner.clear().catch(() => {})
      scannerInstanceRef.current = null
    }
  }, [onScan])

  return (
    <div className="scanner-container">
      <div ref={scannerRef} id="reader" />
    </div>
  )
}

export default Html5QrcodeScannerComponent
