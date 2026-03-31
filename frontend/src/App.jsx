import { useState, useEffect, useCallback } from 'react'
import './App.css'

const CATEGORIES = {
  ropa: 'Ropa',
  farmacia: 'Farmacia',
  despensa: 'Despensa',
  carnes_quesos_salchichas: 'Carnes, Quesos y Salchichas',
  limpieza: 'Limpieza',
  casa: 'Casa',
  bebidas_te: 'Bebidas y Té',
  dulces: 'Dulces',
}

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const debouncedSearch = useDebounce(search)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '48' })
    if (category) params.set('category', category)
    if (debouncedSearch) params.set('search', debouncedSearch)

    try {
      const res = await fetch(`/api/products?${params}`)
      const json = await res.json()
      setProducts(json.data.items)
      setTotal(json.data.meta.total)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, debouncedSearch])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return (
    <>
      <header className="header">
        <div className="header-top">
          <h1>TraigoCostco</h1>
          <p className="header-sub">Productos Costco traídos a Ciudad Guzmán · $40 por artículo</p>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <nav className="categories">
          <button
            className={category === '' ? 'cat-btn active' : 'cat-btn'}
            onClick={() => setCategory('')}
          >
            Todos
          </button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              className={category === key ? 'cat-btn active' : 'cat-btn'}
              onClick={() => setCategory(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {loading && <p className="status">Cargando...</p>}

        {!loading && products.length === 0 && (
          <p className="status">No se encontraron productos.</p>
        )}

        {!loading && products.length > 0 && (
          <>
            <p className="result-count">{total} producto{total !== 1 ? 's' : ''}</p>
            <div className="grid">
              {products.map(p => (
                <div key={p._id} className="card">
                  <img src={p.imageUrl} alt={p.name} loading="lazy" />
                  <div className="card-body">
                    <p className="card-name">{p.name}</p>
                    <p className="card-price">${p.price.toLocaleString('es-MX')}</p>
                    <p className="card-fee">+ $40 servicio</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}
