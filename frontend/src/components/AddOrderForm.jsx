const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export default function AddOrderForm({ onCreated }) {
  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const product = form.get('product')?.toString() ?? ''
    const qty = Number(form.get('qty'))
    const price = Number(form.get('price'))
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, qty, price })
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(j.error || 'Failed to create order')
      return
    }
    e.currentTarget.reset()
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end' }}>
      <div>
        <label>Product<br/><input name="product" placeholder="Name (min 2 chars)" minLength={2} required /></label>
      </div>
      <div>
        <label>Qty<br/><input name="qty" type="number" min="1" step="1" required /></label>
      </div>
      <div>
        <label>Price<br/><input name="price" type="number" min="0.01" step="0.01" required /></label>
      </div>
      <button>Add</button>
    </form>
  )
}
