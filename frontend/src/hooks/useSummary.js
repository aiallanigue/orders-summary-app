import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export function useSummary() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchSummary() {
    const r = await fetch(`${API_BASE}/api/summary`)
    if (!r.ok) throw new Error('Failed to load summary')
    return await r.json()
  }

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetchSummary()
      .then(json => { if (alive) { setData(json); setError(null) } })
      .catch(err => { if (alive) setError(err?.message || String(err)) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  return { data, loading, error, refresh: async () => {
    const j = await fetchSummary()
    setData(j)
    return j
  }}
}
