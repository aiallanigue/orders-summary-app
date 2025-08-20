import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export default function OrderList({ productFilter, limit, offset, onTotal }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (productFilter) params.set('product', productFilter)
    if (limit != null) params.set('limit', String(limit))
    if (offset != null) params.set('offset', String(offset))

    fetch(`${API_BASE}/api/orders?${params.toString()}`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || 'Failed to fetch orders')
        return j
      })
      .then(({ data, total }) => {
        setOrders(data); setError(null); setTotal(total); onTotal?.(total)
      })
      .catch(err => setError(err?.message || String(err)))
      .finally(() => setLoading(false))
  }, [productFilter, limit, offset])

  if (loading) return <p>Loading orders…</p>
  if (error) return <p>Error: {error}</p>
  return (
    <div>
      <p><strong>Total matching:</strong> {total}</p>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Product</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.product}</td>
              <td>{o.qty}</td>
              <td>{o.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
