const STORAGE_KEY = 'whiskqr_history'
const MAX_ENTRIES = 100

export type ScanEntry = {
  id: string
  value: string
  format: string
  timestamp: string
}

export function loadHistory(): ScanEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveHistory(history: ScanEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function addScan(history: ScanEntry[], value: string, format: string): ScanEntry[] {
  const entry: ScanEntry = {
    id: crypto.randomUUID(),
    value,
    format,
    timestamp: new Date().toISOString()
  }
  const updated = [entry, ...history]
  if (updated.length > MAX_ENTRIES) {
    saveHistory(updated.slice(0, MAX_ENTRIES))
    return updated.slice(0, MAX_ENTRIES)
  }
  saveHistory(updated)
  return updated
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
