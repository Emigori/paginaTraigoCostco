import { useState, useEffect, useCallback } from 'react'
import './AdminPanel.css'

const CATEGORIES = [
  { key: 'despensa', label: 'Despensa' },
  { key: 'carnes_quesos_salchichas', label: 'Carnes y Quesos' },
  { key: 'bebidas_te', label: 'Bebidas y Té' },
  { key: 'dulces', label: 'Dulces' },
  { key: 'limpieza', label: 'Limpieza' },
  { key: 'farmacia', label: 'Farmacia' },
  { key: 'ropa', label: 'Ropa' },
  { key: 'casa', label: 'Casa' },
]

const EMPTY_FORM = { name: '', price: '', category: 'despensa', imageUrl: '', imagePublicId: '' }

function cloudinaryThumb(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_80,h_80,c_fill/')
}

export default function AdminPanel({ adminSecret }) {
  const [products, setProducts]     = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('')
  const [page, setPage]             = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const LIMIT = 50

  // Modal
  const [modal, setModal]           = useState(null) // null | 'create' | 'edit'
  const [form, setForm]             = useState(EMPTY_FORM)
  const [editId, setEditId]         = useState(null)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')

  // Subida de imagen
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading]   = useState(false)

  // Imagen suelta (cambiar imagen de producto existente sin editar el resto)
  const [imgModal, setImgModal]     = useState(null) // product object
  const [imgFile, setImgFile]       = useState(null)
  const [imgPreview, setImgPreview] = useState(null)

  const API = import.meta.env.VITE_API_URL ?? ''
  const headers = { 'x-admin-key': adminSecret }

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    const params = new URLSearchParams({ page, limit: LIMIT })
    if (filterCat) params.set('category', filterCat)
    if (search.length >= 2) params.set('search', search)
    try {
      const res = await fetch(`${API}/api/admin/products?${params}`, { headers })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`)
      setProducts(json.data.items)
      setTotalItems(json.data.meta.total)
    } catch (err) {
      setProducts([])
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, filterCat, search, adminSecret])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers })
      const json = await res.json()
      setStats(json.data)
    } catch { /* ignore */ }
  }, [adminSecret])

  useEffect(() => { fetchProducts(); fetchStats() }, [fetchProducts, fetchStats])

  // ── Helpers de modal ───────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setFormError('')
    setEditId(null)
    setModal('create')
  }

  const openEdit = (p) => {
    setForm({ name: p.name, price: String(p.price), category: p.category, imageUrl: p.imageUrl, imagePublicId: p.imagePublicId || '' })
    setImageFile(null)
    setImagePreview(p.imageUrl)
    setFormError('')
    setEditId(p._id)
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setEditId(null); setImageFile(null); setImagePreview(null) }

  const handleImagePick = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // ── Guardar (crear o editar) ───────────────────────────────────────────────
  const handleSave = async () => {
    setFormError('')
    if (!form.name.trim()) return setFormError('El nombre es obligatorio')
    if (!form.price || isNaN(parseFloat(form.price))) return setFormError('El precio debe ser un número')
    if (!form.category) return setFormError('Selecciona una categoría')

    setSaving(true)
    try {
      let imageUrl = form.imageUrl
      let imagePublicId = form.imagePublicId

      // Si hay imagen nueva, subirla primero
      if (imageFile) {
        if (modal === 'edit' && editId) {
          // Si ya existe el producto, subir con el endpoint específico
          setUploading(true)
          const fd = new FormData()
          fd.append('image', imageFile)
          const imgRes = await fetch(`${API}/api/admin/products/${editId}/image`, { method: 'POST', headers, body: fd })
          const imgJson = await imgRes.json()
          setUploading(false)
          if (!imgJson.ok) return setFormError('Error al subir imagen: ' + (imgJson.error || ''))
          imageUrl = imgJson.data.imageUrl
          imagePublicId = imgJson.data.imagePublicId
        } else {
          // Para producto nuevo, subir a Cloudinary via el endpoint temporal
          // Se creará primero el producto, luego se sube la imagen
          imageUrl = ''
          imagePublicId = ''
        }
      }

      if (!imageUrl && modal === 'create' && !imageFile) {
        return setFormError('Agrega una imagen al producto')
      }

      const body = { name: form.name.trim(), price: parseFloat(form.price), category: form.category, imageUrl, imagePublicId }

      let productId = editId
      if (modal === 'create') {
        // Para crear: si hay imagen la subimos después
        if (imageFile) {
          body.imageUrl = 'https://res.cloudinary.com/dboqjes1u/image/upload/v1/costco/placeholder'
        }
        const res = await fetch(`${API}/api/admin/products`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const json = await res.json()
        if (!json.ok) return setFormError(json.error || 'Error al crear producto')
        productId = json.data._id

        // Ahora subir imagen al producto recién creado
        if (imageFile) {
          setUploading(true)
          const fd = new FormData()
          fd.append('image', imageFile)
          const imgRes = await fetch(`${API}/api/admin/products/${productId}/image`, { method: 'POST', headers, body: fd })
          const imgJson = await imgRes.json()
          setUploading(false)
          if (!imgJson.ok) return setFormError('Producto creado pero error al subir imagen')
          // Actualizar con la imagen real
          await fetch(`${API}/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: imgJson.data.imageUrl, imagePublicId: imgJson.data.imagePublicId }),
          })
        }
      } else {
        const res = await fetch(`${API}/api/admin/products/${editId}`, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const json = await res.json()
        if (!json.ok) return setFormError(json.error || 'Error al actualizar')
      }

      closeModal()
      fetchProducts()
      fetchStats()
    } catch (e) {
      setFormError('Error de red: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (p) => {
    if (!confirm(`¿Desactivar "${p.name}"? No se borrará permanentemente.`)) return
    await fetch(`${API}/api/admin/products/${p._id}`, { method: 'DELETE', headers })
    fetchProducts()
    fetchStats()
  }

  // ── Cambiar solo imagen ────────────────────────────────────────────────────
  const openImgModal = (p) => { setImgModal(p); setImgFile(null); setImgPreview(p.imageUrl) }
  const closeImgModal = () => { setImgModal(null); setImgFile(null); setImgPreview(null) }

  const handleImgPick = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleImgSave = async () => {
    if (!imgFile) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', imgFile)
      const res = await fetch(`${API}/api/admin/products/${imgModal._id}/image`, { method: 'POST', headers, body: fd })
      const json = await res.json()
      if (!json.ok) { alert('Error al subir imagen'); return }
      closeImgModal()
      fetchProducts()
    } finally {
      setUploading(false)
    }
  }

  const totalPages = Math.ceil(totalItems / LIMIT)

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <header className="adm-header">
        <div className="adm-header-left">
          <span className="adm-logo">🛒</span>
          <span className="adm-title">TraigoCostco <em>Admin</em></span>
        </div>
        <a href="/" className="adm-back">← Ver tienda</a>
      </header>

      {/* ── Stats ── */}
      {stats && (
        <div className="adm-stats">
          <div className="adm-stat-card">
            <p className="adm-stat-num">{stats.total}</p>
            <p className="adm-stat-label">Productos activos</p>
          </div>
          {stats.byCategory.map(c => (
            <div key={c._id} className="adm-stat-card">
              <p className="adm-stat-num">{c.count}</p>
              <p className="adm-stat-label">{CATEGORIES.find(x => x.key === c._id)?.label || c._id}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Barra de herramientas ── */}
      <div className="adm-toolbar">
        <button className="adm-btn-add" onClick={openCreate}>＋ Agregar producto</button>
        <a href={`/${adminSecret}/categorizar`} className="adm-btn-cat">📦 Categorizar nuevos</a>
        <input
          className="adm-search"
          type="search"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select className="adm-select" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1) }}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>

      {/* ── Tabla ── */}
      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-status">Cargando...</p>
        ) : fetchError ? (
          <p className="adm-status" style={{color:'#c0392b'}}>⚠️ Error: {fetchError}</p>
        ) : products.length === 0 ? (
          <p className="adm-status">No hay productos.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className={!p.isActive ? 'adm-row-inactive' : ''}>
                  <td>
                    <img
                      src={cloudinaryThumb(p.imageUrl)}
                      alt={p.name}
                      className="adm-thumb"
                      onClick={() => openImgModal(p)}
                      title="Cambiar imagen"
                    />
                  </td>
                  <td className="adm-td-name">{p.name}</td>
                  <td>${p.price.toLocaleString('es-MX')}</td>
                  <td>{CATEGORIES.find(c => c.key === p.category)?.label || p.category}</td>
                  <td>
                    <span className={`adm-badge ${p.isActive ? 'adm-badge-on' : 'adm-badge-off'}`}>
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="adm-td-actions">
                    <button className="adm-btn-edit" onClick={() => openEdit(p)}>✏️ Editar</button>
                    <button className="adm-btn-img" onClick={() => openImgModal(p)}>🖼 Imagen</button>
                    {p.isActive && (
                      <button className="adm-btn-del" onClick={() => handleDelete(p)}>🗑 Desactivar</button>
                    )}
                    {!p.isActive && (
                      <button className="adm-btn-restore" onClick={async () => {
                        await fetch(`${API}/api/admin/products/${p._id}`, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: true }) })
                        fetchProducts(); fetchStats()
                      }}>↩ Restaurar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div className="adm-pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Anterior</button>
          <span>Página {page} de {totalPages} ({totalItems} productos)</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente ›</button>
        </div>
      )}

      {/* ── Modal crear/editar ── */}
      {modal && (
        <div className="adm-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? '＋ Agregar producto' : '✏️ Editar producto'}</h2>

            <div className="adm-form">
              <label>Nombre</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Nesquik 1.1 kg" />

              <label>Precio (MXN)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="269" />

              <label>Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>

              <label>Imagen</label>
              <div className="adm-img-pick">
                {imagePreview && <img src={imagePreview} alt="preview" className="adm-preview" />}
                <label className="adm-file-btn">
                  📷 {imageFile ? imageFile.name : 'Seleccionar foto'}
                  <input type="file" accept="image/*" onChange={handleImagePick} hidden />
                </label>
              </div>

              {formError && <p className="adm-error">{formError}</p>}
            </div>

            <div className="adm-modal-actions">
              <button className="adm-btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="adm-btn-save" onClick={handleSave} disabled={saving || uploading}>
                {uploading ? '⬆ Subiendo imagen...' : saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal solo imagen ── */}
      {imgModal && (
        <div className="adm-overlay" onClick={closeImgModal}>
          <div className="adm-modal adm-modal-sm" onClick={e => e.stopPropagation()}>
            <h2>🖼 Cambiar imagen</h2>
            <p className="adm-modal-sub">{imgModal.name}</p>

            <div className="adm-img-pick">
              {imgPreview && <img src={imgPreview} alt="preview" className="adm-preview-lg" />}
              <label className="adm-file-btn">
                📷 {imgFile ? imgFile.name : 'Seleccionar nueva foto'}
                <input type="file" accept="image/*" onChange={handleImgPick} hidden />
              </label>
            </div>

            <div className="adm-modal-actions">
              <button className="adm-btn-cancel" onClick={closeImgModal}>Cancelar</button>
              <button className="adm-btn-save" onClick={handleImgSave} disabled={!imgFile || uploading}>
                {uploading ? '⬆ Subiendo...' : 'Guardar imagen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
