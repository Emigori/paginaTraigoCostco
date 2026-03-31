# TraigoCostco — Contexto del proyecto

## Negocio
Grupo de ventas **TraigoCostco**: se traen productos de Costco Guadalajara a Ciudad Guzmán. Se cobran 40 pesos por artículo. El grupo de WhatsApp tiene más de 1,000 personas. La página web es para llegar a mayor alcance.

## Fase 1 (única fase planeada)
- Mostrar productos por sección/categoría
- Buscador con lupita
- Sin carrito, sin pagos, sin login

## Stack: MERN
- **Backend**: Node.js + Express + Mongoose (ES Modules, `"type": "module"`)
- **Frontend**: React (aún sin inicializar, carpeta `frontend/` vacía)
- **DB**: MongoDB Atlas (conexión en `backend/.env`)

## Estructura
```
/
├── backend/
│   └── src/
│       ├── app.js              # Express app, CORS, rutas
│       ├── server.js           # Entry point, conecta DB y levanta servidor
│       ├── config/db.js        # connectDB()
│       ├── constants/categories.js  # CATEGORY_ENUM y CATEGORY_LABELS
│       ├── controllers/productController.js  # listProducts — conectado a MongoDB
│       ├── models/Product.js   # Schema Mongoose
│       ├── routes/productRoutes.js  # GET /api/products, GET /api/products/categories
│       └── middlewares/errorHandler.js
└── frontend/                   # Vite + React inicializado
    └── src/
        ├── App.jsx             # UI principal: header, buscador, filtros, grid
        ├── App.css             # Estilos
        └── index.css           # Reset global
```

## API actual
- `GET /api/health`
- `GET /api/products?category=&search=&page=&limit=`  — `items: []` (stub, aún sin query a DB)
- `GET /api/products/categories`

## Categorías
`ropa`, `farmacia`, `despensa`, `carnes_quesos_salchichas`, `limpieza`, `casa`, `bebidas_te`, `dulces`

## Modelo Product
`productId` (unique), `name`, `price`, `category` (enum), `imageUrl`, `imagePublicId`, `isActive`, `timestamps`

## Pendiente inmediato
1. Conectar `listProducts` a MongoDB (query real con filtros category/search/page)
2. Inicializar frontend con Vite + React
3. UI: grid de productos por categoría + buscador

## Comandos
```bash
cd backend && npm run dev   # puerto 4000
```
