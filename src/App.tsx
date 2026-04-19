import { useState, useEffect, useCallback } from 'react'
import Scanner from './components/Scanner'
import { loadHistory, addScan, clearHistory, ScanEntry } from './lib/history'

type ScanResult = {
  value: string
  format: string
  timestamp: string
} | null

type View = 'scanner' | 'result' | 'history'

function App() {
  const [result, setResult] = useState<ScanResult>(null)
  const [view, setView] = useState<View>('scanner')
  const [history, setHistory] = useState<ScanEntry[]>([])

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const handleScan = useCallback((decoded: string, format: string) => {
    setHistory(prev => {
      const newHistory = addScan(prev, decoded, format)
      setResult({ value: decoded, format, timestamp: newHistory[0].timestamp })
      setView('result')
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      return newHistory
    })
  }, [])

  function handleReset() {
    setResult(null)
    setView('scanner')
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>WhiskQR</h1>
        {view === 'scanner' && history.length > 0 && (
          <button className="btn-history" onClick={() => setView('history')}>
            History ({history.length})
          </button>
        )}
        {view === 'history' && (
          <div className="history-header-actions">
            <button className="btn-back" onClick={() => setView('scanner')}>
              ← Scanner
            </button>
            <button className="btn-clear" onClick={handleClearHistory}>
              Clear All
            </button>
          </div>
        )}
      </header>

      {view === 'scanner' && (
        <Scanner onScan={handleScan} />
      )}

      {view === 'result' && result ? (
        <div className="result-view">
          <div className="result-icon">✓</div>
          <p className="result-label">Scanned</p>
          <p className="result-value">{result.value}</p>
          <p className="result-format">{result.format}</p>
          <div className="result-actions">
            <button className="btn-restart" onClick={handleReset}>
              Scan Another
            </button>
            {history.length > 0 && (
              <button className="btn-history-result" onClick={() => setView('history')}>
                History ({history.length})
              </button>
            )}
          </div>
        </div>
      ) : null}

      {view === 'history' && (
        <div className="history-view">
          {history.length === 0 ? (
            <p className="history-empty">No scans yet</p>
          ) : (
            <ul className="history-list">
              {history.map(entry => (
                <li key={entry.id} className="history-item">
                  <div className="history-item-main">
                    <p className="history-item-value">{entry.value}</p>
                    <p className="history-item-format">{entry.format}</p>
                  </div>
                  <p className="history-item-time">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default App
