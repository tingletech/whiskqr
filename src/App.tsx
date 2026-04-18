import { useState } from 'react'
import Scanner from './components/Scanner'

type ScanResult = {
  value: string
  format: string
  timestamp: Date
} | null

function App() {
  const [result, setResult] = useState<ScanResult>(null)
  const [scanning, setScanning] = useState(true)

  function handleScan(decoded: string, _format: string) {
    setResult({ value: decoded, format: _format, timestamp: new Date() })
    setScanning(false)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  }

  function handleReset() {
    setResult(null)
    setScanning(true)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>WhiskQR</h1>
      </header>

      {scanning ? (
        <Scanner onScan={handleScan} />
      ) : result ? (
        <div className="result-view">
          <div className="result-icon">✓</div>
          <p className="result-label">Scanned</p>
          <p className="result-value">{result.value}</p>
          <p className="result-format">{result.format}</p>
          <button className="btn-restart" onClick={handleReset}>
            Scan Another
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
