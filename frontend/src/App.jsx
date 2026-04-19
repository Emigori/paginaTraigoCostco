import { useState, useEffect, useCallback, useRef } from 'react'
import logo from './assets/logo.png'
import './App.css'

const WHATSAPP_URL = 'https://chat.whatsapp.com/Cxn6xVBMHDSBhd7S0gcTmW?mode=gi_t'

const SLIDES = [
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
  { key: 'despensa', label: 'Despensa', emoji: '🥫' },
  { key: 'carnes_quesos_salchichas', label: 'Carnes y Quesos', emoji: '🥩' },
  { key: 'bebidas_te', label: 'Bebidas y Té', emoji: '🥤' },
  { key: 'dulces', label: 'Dulces', emoji: '🍫' },
  { key: 'limpieza', label: 'Limpieza', emoji: '🧹' },
  { key: 'farmacia', label: 'Farmacia', emoji: '💊' },
  { key: 'ropa', label: 'Ropa', emoji: '👕' },
  { key: 'casa', label: 'Casa', emoji: '🏠' },
]

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [slide, setSlide] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [lightbox, setLightbox] = useState(null) // { imageUrl, name }
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

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '60' })
    if (category) params.set('category', category)
    if (debouncedSearch) params.set('search', debouncedSearch)
    try {
      const res = await fetch(`/api/products?${params}`)
      const json = await res.json()
      setProducts(json.data.items)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, debouncedSearch])

  useEffect(() => { fetchProducts() }, [fetchProducts])

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
          {category ? CATEGORIES.find(c => c.key === category)?.label : 'Todos los productos'}
        </p>

        {loading && <p className="status">Cargando productos...</p>}

        {!loading && products.length === 0 && (
          <div className="empty">
            <p>😕 No encontramos productos.</p>
            <button className="reset-btn" onClick={() => { setSearch(''); setCategory('') }}>
              Ver todos
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid">
            {products.map(p => (
              <div key={p._id} className="card">
                <div className="card-img-wrap" onClick={() => setLightbox(p)}>
                  <img src={p.imageUrl} alt={p.name} loading="lazy" />
                  <span className="zoom-hint">🔍 Ver grande</span>
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
            <img src={lightbox.imageUrl} alt={lightbox.name} />
            <p className="lightbox-name">{lightbox.name}</p>
            <p className="lightbox-price">
              ${lightbox.price.toLocaleString('es-MX')} <span>+ $40 servicio</span>
            </p>
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
