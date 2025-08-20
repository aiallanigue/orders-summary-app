import { useMemo, useState } from 'react'
import { useSummary } from './hooks/useSummary'
import OrderList from './components/OrderList'
import AddOrderForm from './components/AddOrderForm'
import Filters from './components/Filters'

export default function App() {
  const { data: summary, loading, error, refresh } = useSummary()
  const [productFilter, setProductFilter] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const showVal = v => (v === null || v === undefined ? '—' : v)

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Orders Summary</h1>

      {loading && <p>Loading summary…</p>}
      {error && <p>Error: {error}</p>}

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <Stat label="Total Revenue" value={showVal(summary.totalRevenue?.toFixed ? summary.totalRevenue.toFixed(2) : summary.totalRevenue)} />
          <Stat label="Median Order Price" value={showVal(summary.medianOrderPrice?.toFixed ? summary.medianOrderPrice.toFixed(2) : summary.medianOrderPrice)} />
          <Stat label="Top Product (Qty)" value={showVal(summary.topProductByQty)} />
          <Stat label="Unique Products" value={summary.uniqueProductCount} />
        </div>
      )}

      <h2>Add Order</h2>
      <AddOrderForm onCreated={refresh} />

      <h2 style={{ marginTop: 24 }}>Orders</h2>
      <Filters
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
      />
      <OrderList
        productFilter={productFilter}
        limit={pageSize}
        offset={page * pageSize}
        onTotal={setTotal}
      />
      <p style={{ marginTop: 8 }}>
        Showing page {page + 1} of {Math.max(1, Math.ceil(total / pageSize))}
      </p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
