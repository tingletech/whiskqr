import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5QrcodeScanner as Html5QrcodeScannerLib } from 'html5-qrcode'

interface Props {
  onScan: (decoded: string, format: string) => void
}

interface TorchSettings extends MediaTrackSettings {
  torch?: boolean
}

function Html5QrcodeScannerComponent({ onScan }: Props) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const scannerInstanceRef = useRef<Html5QrcodeScannerLib | null>(null)
  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)
  const torchCheckTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkTorchCapability = useCallback(() => {
    const scanner = scannerInstanceRef.current
    if (!scanner) return
    try {
      const settings = scanner.getRunningTrackSettings() as TorchSettings
      if (settings.torch !== undefined) {
        setTorchSupported(true)
        setTorchOn(Boolean(settings.torch))
      }
    } catch {
      setTorchSupported(false)
    }
  }, [])

  useEffect(() => {
    if (!scannerRef.current) return

    const scanner = new Html5QrcodeScannerLib(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        disableFlip: false
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

    torchCheckTimerRef.current = setInterval(checkTorchCapability, 1000)

    return () => {
      if (torchCheckTimerRef.current) {
        clearInterval(torchCheckTimerRef.current)
        torchCheckTimerRef.current = null
      }
      scanner.clear().catch(() => {})
      scannerInstanceRef.current = null
    }
  }, [onScan, checkTorchCapability])

  const toggleTorch = useCallback(async () => {
    const scanner = scannerInstanceRef.current
    if (!scanner) return
    try {
      const newTorchState = !torchOn
      await (scanner as unknown as {
        applyVideoConstraints: (constraints: { advanced?: { torch?: boolean }[] }) => Promise<void>
      }).applyVideoConstraints({ advanced: [{ torch: newTorchState }] })
      setTorchOn(newTorchState)
    } catch {
      setTorchSupported(false)
    }
  }, [torchOn])

  return (
    <div className="scanner-container">
      <div ref={scannerRef} id="reader" />
      {torchSupported && (
        <button
          className={`flash-button ${torchOn ? 'flash-button-on' : ''}`}
          onClick={toggleTorch}
          aria-label="Toggle flashlight"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Html5QrcodeScannerComponent
