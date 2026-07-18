export interface HistoryEntry {
  id: number
  type: string
  detail: string
  date: string
}

const STORAGE_KEY = 'cvcraft_history'

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

export function addHistory(type: string, detail: string): HistoryEntry {
  const existing = getHistory()
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const entry: HistoryEntry = {
    id: Date.now(),
    type,
    detail,
    date,
  }
  const merged = [entry, ...existing].slice(0, 50)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  return entry
}

export function deleteHistory(id: number): void {
  const updated = getHistory().filter((h) => h.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
