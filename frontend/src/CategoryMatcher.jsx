import { useState, useEffect, useCallback } from 'react'
import './CategoryMatcher.css'

const API = import.meta.env.VITE_API_URL ?? ''

const CATS = [
  { key: 'despensa',               label: 'Despensa',       emoji: '🥫' },
  { key: 'carnes_quesos_salchichas', label: 'Carnes',        emoji: '🥩' },
  { key: 'bebidas_te',             label: 'Bebidas',         emoji: '🥤' },
  { key: 'dulces',                 label: 'Dulces',          emoji: '🍫' },
  { key: 'limpieza',               label: 'Limpieza',        emoji: '🧹' },
  { key: 'farmacia',               label: 'Farmacia',        emoji: '💊' },
  { key: 'ropa',                   label: 'Ropa',            emoji: '👕' },
  { key: 'casa',                   label: 'Casa',            emoji: '🏠' },
]

function cloudinaryThumb(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_300,h_300,c_fill/')
}

export default function CategoryMatcher({ adminSecret }) {
  const headers = { 'x-admin-key': adminSecret }

  const [products, setProducts]     = useState([])
  const [changes, setChanges]       = useState({}) // { id: category }
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [savedCount, setSavedCount] = useState(null)

  // Selección múltiple
  const [selected, setSelected]     = useState(new Set())
  const [bulkCat, setBulkCat]       = useState('')

  const fetchUncategorized = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/admin/products?category=sin_categorizar&limit=100`, { headers })
      const json = await res.json()
      setProducts(json.data.items)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [adminSecret])

  useEffect(() => { fetchUncategorized() }, [fetchUncategorized])

  const assignCat = (id, cat) => {
    setChanges(prev => ({ ...prev, [id]: cat }))
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const applyBulk = () => {
    if (!bulkCat || selected.size === 0) return
    const newChanges = { ...changes }
    selected.forEach(id => { newChanges[id] = bulkCat })
    setChanges(newChanges)
    setSelected(new Set())
    setBulkCat('')
  }

  const pendingCount = Object.keys(changes).length

  const handleSave = async () => {
    if (pendingCount === 0) return
    setSaving(true)
    try {
      const updates = Object.entries(changes).map(([id, category]) => ({ id, category }))
      const res = await fetch(`${API}/api/admin/products/batch-category`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      const json = await res.json()
      if (json.ok) {
        setSavedCount(json.data.modified)
        setChanges({})
        setSelected(new Set())
        await fetchUncategorized()
        setTimeout(() => setSavedCount(null), 3000)
      }
    } finally { setSaving(false) }
  }

  const remaining = products.filter(p => !changes[p._id])

  return (
    <div className="cm-page">

      {/* ── Header ── */}
      <header className="cm-header">
        <a href="/tcadmin7k2m" className="cm-back">← Admin</a>
        <h1 className="cm-title">📦 Categorizar productos</h1>
        <div className="cm-count">
          {loading ? '...' : `${products.length} sin categorizar`}
        </div>
      </header>

      {/* ── Bulk assign ── */}
      {selected.size > 0 && (
        <div className="cm-bulk">
          <span className="cm-bulk-info">{selected.size} seleccionados</span>
          <div className="cm-bulk-cats">
            {CATS.map(c => (
              <button
                key={c.key}
                className={`cm-bulk-btn ${bulkCat === c.key ? 'cm-bulk-active' : ''}`}
                onClick={() => setBulkCat(c.key)}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <button className="cm-bulk-apply" onClick={applyBulk} disabled={!bulkCat}>
            Asignar a todos
          </button>
          <button className="cm-bulk-cancel" onClick={() => setSelected(new Set())}>✕</button>
        </div>
      )}

      {/* ── Guardar ── */}
      {pendingCount > 0 && (
        <div className="cm-save-bar">
          <span>{pendingCount} producto{pendingCount > 1 ? 's' : ''} listo{pendingCount > 1 ? 's' : ''} para guardar</span>
          <button className="cm-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : `💾 Guardar todo`}
          </button>
        </div>
      )}

      {savedCount !== null && (
        <div className="cm-success">✅ {savedCount} productos guardados correctamente</div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <p className="cm-status">Cargando productos sin categorizar...</p>
      ) : products.length === 0 ? (
        <div className="cm-empty">
          <p>🎉 ¡No hay productos sin categorizar!</p>
          <a href="/tcadmin7k2m" className="cm-empty-link">Volver al panel</a>
        </div>
      ) : (
        <div className="cm-grid">
          {products.map(p => {
            const assigned = changes[p._id]
            const isSelected = selected.has(p._id)
            const catInfo = CATS.find(c => c.key === assigned)

            return (
              <div
                key={p._id}
                className={`cm-card ${assigned ? 'cm-card-done' : ''} ${isSelected ? 'cm-card-selected' : ''}`}
              >
                {/* Checkbox selección múltiple */}
                <button
                  className={`cm-checkbox ${isSelected ? 'cm-checkbox-on' : ''}`}
                  onClick={() => toggleSelect(p._id)}
                  title="Seleccionar para asignar en grupo"
                >
                  {isSelected ? '✓' : ''}
                </button>

                {/* Imagen */}
                <div className="cm-img-wrap">
                  <img src={cloudinaryThumb(p.imageUrl)} alt={p.name} loading="lazy" />
                  {assigned && (
                    <div className="cm-assigned-overlay">
                      <span>{catInfo?.emoji} {catInfo?.label}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="cm-info">
                  <p className="cm-name">{p.name}</p>
                  <p className="cm-price">${p.price.toLocaleString('es-MX')}</p>
                </div>

                {/* Botones de categoría */}
                <div className="cm-cats">
                  {CATS.map(c => (
                    <button
                      key={c.key}
                      className={`cm-cat-btn ${assigned === c.key ? 'cm-cat-active' : ''}`}
                      onClick={() => assignCat(p._id, c.key)}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Footer fijo con resumen ── */}
      {!loading && products.length > 0 && (
        <div className="cm-footer">
          <span>✅ {pendingCount} asignados · ⏳ {remaining.length} pendientes</span>
          {pendingCount > 0 && (
            <button className="cm-save-btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '...' : `💾 Guardar (${pendingCount})`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
