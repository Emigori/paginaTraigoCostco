import { useState, useEffect, useCallback, useRef } from 'react'
import logo from './assets/logo.png'
import './App.css'

const WHATSAPP_URL = 'https://chat.whatsapp.com/Cxn6xVBMHDSBhd7S0gcTmW?mode=gi_t'
const API = import.meta.env.VITE_API_URL ?? ''

/**
 * Inserta transformaciones de Cloudinary en la URL para servir
 * la imagen al tamaño correcto en lugar de la foto a resolución completa.
 * - card: 600×600 px, recorte centrado, calidad automática, formato WebP
 * - lightbox: 960×960 px, mismo tratamiento
 */
function cloudinaryUrl(url, size = 'card') {
  if (!url || !url.includes('res.cloudinary.com')) return url
  const transform = size === 'lightbox'
    ? 'f_auto,q_auto,w_1200,c_limit'
    : 'f_auto,q_auto,w_600,c_limit'
  return url.replace('/upload/', `/upload/${transform}/`)
}


const SLIDES = [
  {
    title: '¿Quieres pedir algo?',
    sub: 'Esta página es solo un catálogo',
    detail: 'Toma captura de pantalla y mándala al grupo 📷',
    bg: 'slide-green',
  },
  {
    title: 'Productos Costco',
    sub: 'Directo a Ciudad Guzmán',
    detail: 'Solo $40 por artículo',
    bg: 'slide-red',
  },
  {
    title: '¡Más de 1,000 clientes!',
    sub: 'Únete al grupo de WhatsApp',
    detail: 'Nuevos productos cada semana',
    bg: 'slide-blue',
  },
  {
    title: 'Calidad Costco',
    sub: 'Ropa, despensa, farmacia y más',
    detail: 'Pídelo y te lo traemos',
    bg: 'slide-dark',
  },
]

const CATEGORIES = [
  { key: '', label: 'Ver todo', emoji: '🛒' },
  { key: 'novedades', label: 'Novedades', emoji: '🆕' },
  { key: 'despensa', label: 'Despensa', emoji: '🥫' },
  { key: 'carnes_quesos_salchichas', label: 'Carnes y Quesos', emoji: '🥩' },
  { key: 'bebidas_te', label: 'Bebidas y Té', emoji: '🥤' },
  { key: 'dulces', label: 'Dulces', emoji: '🍫' },
  { key: 'limpieza', label: 'Limpieza', emoji: '🧹' },
  { key: 'farmacia', label: 'Farmacia', emoji: '💊' },
  { key: 'ropa', label: 'Ropa', emoji: '👕' },
  { key: 'casa', label: 'Casa', emoji: '🏠' },
]

// Devuelve true si el producto fue creado hace menos de 7 días
function isNew(product) {
  if (!product.createdAt) return false
  return Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
}

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const PAGE_SIZE = 24

export default function App() {
  const [slide, setSlide] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const timerRef = useRef(null)

  const debouncedSearch = useDebounce(search)

  // Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [])

  const goSlide = (i) => {
    clearInterval(timerRef.current)
    setSlide(i)
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length)
    }, 4000)
  }

  // Reset página cuando cambia filtro o búsqueda
  useEffect(() => { setPage(1); setProducts([]) }, [category, debouncedSearch])

  // Fetch products
  const fetchProducts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      let url
      if (category === 'novedades') {
        url = `${API}/api/products/novedades`
      } else {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(pageNum) })
        if (category) params.set('category', category)
        if (debouncedSearch) params.set('search', debouncedSearch)
        url = `${API}/api/products?${params}`
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const items = json.data.items
      setApiError(false)
      setProducts(prev => append ? [...prev, ...items] : items)
      if (json.data.meta) setTotal(json.data.meta.total)
      else setTotal(items.length)
    } catch {
      if (!append) {
        setApiError(true)
        setProducts([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [category, debouncedSearch])

  useEffect(() => { fetchProducts(1, false) }, [fetchProducts])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage, true)
  }

  const hasMore = category !== 'novedades' && products.length < total

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="page">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <img src={logo} alt="TraigoCostco" className="nav-logo" />
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="nav-wa">
          <span>📱</span> Unirse al grupo
        </a>
      </nav>

      {/* ── Slider ── */}
      <section className="slider">
        {SLIDES.map((s, i) => (
          <div key={i} className={`slide ${s.bg} ${i === slide ? 'active' : ''}`}>
            <div className="slide-content">
              <img src={logo} alt="" className="slide-logo" />
              <div className="slide-text">
                <h2>{s.title}</h2>
                <p className="slide-sub">{s.sub}</p>
                <p className="slide-detail">{s.detail}</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="slide-btn">
                  📱 Unirme al grupo de WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
        <div className="slide-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === slide ? 'active' : ''}`}
              onClick={() => goSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Buscador ── */}
      <section className="search-section">
        <label className="search-label" htmlFor="buscar">🔍 ¿Qué estás buscando?</label>
        <input
          id="buscar"
          type="search"
          placeholder="Ej: aceite, vitaminas, papel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>

      {/* ── Categorías ── */}
      <section className="cat-section">
        <p className="section-title">Categorías</p>
        <div className="cat-grid">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`cat-tile ${category === c.key ? 'active' : ''}`}
              onClick={() => setCategory(c.key)}
            >
              <span className="cat-emoji">{c.emoji}</span>
              <span className="cat-label">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Productos ── */}
      <main className="main">
        <p className="section-title">
          {category === 'novedades'
            ? '🆕 Últimos 30 productos agregados'
            : category
              ? CATEGORIES.find(c => c.key === category)?.label
              : 'Todos los productos'}
        </p>

        {(category === 'casa' || category === 'ropa') && (
          <div className="notice-banner">
            <span className="notice-icon">💡</span>
            <div className="notice-text">
              <strong>Esta sección cambia seguido</strong> — ropa y artículos para el hogar son los productos que más rotan, por lo que no siempre hay gran variedad aquí.
              <br />
              Si quieres ver las novedades al momento, <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">únete al grupo de WhatsApp</a> donde se publican primero. 📱
            </div>
          </div>
        )}

        {loading && (
          <div className="grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card card-skeleton">
                <div className="skel-img" />
                <div className="card-body">
                  <div className="skel-line skel-name" />
                  <div className="skel-line skel-price" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && apiError && (
          <div className="maintenance">
            <p className="maintenance-icon">🔧</p>
            <p className="maintenance-title">Estamos en mantenimiento</p>
            <p className="maintenance-sub">Vuelve en unos minutos. Mientras tanto puedes ver los productos en el grupo de WhatsApp.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="maintenance-btn">
              📱 Ir al grupo de WhatsApp
            </a>
          </div>
        )}

        {!loading && !apiError && products.length === 0 && (
          <div className="empty">
            <p>😕 No encontramos productos.</p>
            <button className="reset-btn" onClick={() => { setSearch(''); setCategory('') }}>
              Ver todos
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            <div className="grid">
              {products.map(p => (
                <div key={p._id} className="card">
                  <div className="card-img-wrap" onClick={() => setLightbox(p)}>
                    <img src={cloudinaryUrl(p.imageUrl, 'card')} alt={p.name} loading="lazy" />
                    <span className="zoom-hint">🔍 Ver grande</span>
                    {isNew(p) && <span className="badge-nuevo">NUEVO</span>}
                  </div>
                  <div className="card-body">
                    <p className="card-name">{p.name}</p>
                    <p className="card-price">
                      ${p.price.toLocaleString('es-MX')}
                      <span className="card-fee"> + $40</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="load-more-wrap">
                <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? 'Cargando...' : `Ver más productos (${total - products.length} restantes)`}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── WhatsApp flotante ── */}
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="wa-float">
        📱
      </a>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={cloudinaryUrl(lightbox.imageUrl, 'lightbox')} alt={lightbox.name} />
            <p className="lightbox-name">{lightbox.name}</p>
            <p className="lightbox-price">
              ${lightbox.price.toLocaleString('es-MX')} <span>+ $40 servicio</span>
            </p>
            <p className="lightbox-hint">📷 Toma una captura y mándala al grupo</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="lightbox-wa-btn">
              📱 Ir al grupo de WhatsApp
            </a>
          </div>
        </div>
      )}

      <footer className="footer">
        <img src={logo} alt="TraigoCostco" className="footer-logo" />
        <p>Ciudad Guzmán · Precios Costco Guadalajara + $40 por artículo</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">📱 Unirme al grupo</a>
      </footer>

    </div>
  )
}
