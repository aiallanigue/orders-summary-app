export default function Filters({ productFilter, setProductFilter, page, setPage, pageSize }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
      <input
        placeholder="Filter by product"
        value={productFilter}
        onChange={e => setProductFilter(e.target.value)}
      />
      <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Prev</button>
      <span>Page {page + 1}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
      <span style={{ marginLeft: 'auto' }}>Page size: {pageSize}</span>
    </div>
  )
}
