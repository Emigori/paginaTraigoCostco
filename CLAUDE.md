# TraigoCostco — Página web

## Flujo completo para agregar una nueva categoría

### 1. Mandar las fotos al grupo de WhatsApp (GrupoScrapper)
Mandar cada foto con el nombre y precio como **pie de foto (caption)**:
```
[foto] con caption → "Nesquik 269"
[foto] con caption → "Jamón de pavo Kirkland 189"
```
El último número del caption es el precio. No hace falta mandar texto por separado.

### 2. Cambiar la categoría en el scraper
Editar `~/Desktop/traigo-costco-productos/config/settings.js`:
```js
category: "despensa",               // ← nueva categoría
cloudinaryFolder: "costco/despensa", // ← siempre "costco/<category>"
```

### 3. Correr el scraper (en traigo-costco-productos)
```bash
cd ~/Desktop/traigo-costco-productos
node index.js
```
Resultado: imágenes subidas a Cloudinary + productos guardados en MongoDB.

### 3. (Opcional) Verificar imágenes con el matcher visual
El scraper empareja imagen+texto automáticamente — normalmente no hace falta. Solo usar si algo quedó mal asignado.
```bash
cd ~/Desktop/paginaTraigoCostco
node generate-matcher.mjs despensa   # ← pasar la categoría como argumento
open matcher.html                    # abrir en browser
# → click en producto → click en su imagen correcta → "Guardar mapping (JSON)"
node apply-mapping.mjs               # aplica el mapping a MongoDB
```

### 4. Ver en la página
Los productos nuevos aparecen automáticamente. Si el backend/frontend ya están corriendo, solo recarga el browser.

---

## Contexto del negocio
Grupo de ventas **TraigoCostco**: se traen productos de Costco Guadalajara a Ciudad Guzmán. Se cobran 40 pesos por artículo. El grupo de WhatsApp tiene más de 1,000 personas. La página web es para llegar a mayor alcance.

## Fase 1 (única fase planeada)
- Mostrar productos por sección/categoría
- Buscador con lupita
- Sin carrito, sin pagos, sin login

## Stack: MERN
- **Backend**: Node.js + Express + Mongoose (ES Modules, `"type": "module"`)
- **Frontend**: React + Vite
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
│       ├── controllers/productController.js  # listProducts con filtros
│       ├── models/Product.js   # Schema Mongoose
│       ├── routes/productRoutes.js  # GET /api/products, GET /api/products/categories
│       └── middlewares/errorHandler.js
├── frontend/
│   └── src/
│       ├── App.jsx             # UI principal: header, buscador, filtros, grid, lightbox
│       ├── App.css             # Estilos
│       └── index.css           # Reset global
├── generate-matcher.mjs        # Genera matcher.html para asignar imágenes a productos
├── apply-mapping.mjs           # Aplica image-mapping.json a MongoDB
├── fix-images.mjs              # Diagnóstico de imágenes en Cloudinary vs DB
└── fix-images-v2.mjs           # Asignación automática de imágenes (primer intento)
```

## API
- `GET /api/health`
- `GET /api/products?category=&search=&page=&limit=`
- `GET /api/products/categories`

## Categorías
`ropa`, `farmacia`, `despensa`, `carnes_quesos_salchichas`, `limpieza`, `casa`, `bebidas_te`, `dulces`

## Modelo Product
`productId` (unique), `name`, `price`, `category` (enum), `imageUrl`, `imagePublicId`, `isActive`, `timestamps`

## Imágenes — notas importantes
- Las imágenes están en Cloudinary bajo `costco/<category>/`
- Las imágenes de Cloudinary se sirven con transformación: `w_800,c_limit,q_90` (en App.jsx → `cloudinaryUrl()`)
- El lightbox usa `w_1200,c_limit,q_90`
- **No usar `c_fill`** — recorta hacia el fondo desenfocado. Usar `c_limit` que preserva la imagen completa y deja que CSS haga el crop visual con `object-fit: cover`

## Comandos
```bash
cd backend && npm run dev    # puerto 4000
cd frontend && npm run dev   # puerto 5173
```
