# TraigoCostco — Estado del proyecto

## ¿Qué es esto?
Página web para el grupo de ventas TraigoCostco: se traen productos de Costco Guadalajara a Ciudad Guzmán. Se cobran $40 por artículo. El grupo de WhatsApp tiene más de 1,000 personas.

## URLs
- **Página pública**: https://traigocostco.com.mx
- **Backend API**: https://paginatraigocostco-production.up.railway.app
- **Panel de admin**: `traigocostco.com.mx/{ADMIN_SECRET}` — ver Railway
- **Categorizar productos**: `traigocostco.com.mx/{ADMIN_SECRET}/categorizar`

## Estado actual ✅
- Página desplegada en Vercel (frontend)
- Backend desplegado en Railway (Express + MongoDB Atlas)
- Imágenes en Cloudinary (cloud: dboqjes1u, key: ScrapperR)
- Panel de admin funcionando — clave en Railway → `ADMIN_SECRET`
- Sección Novedades + badge NUEVO en productos recientes
- Dominio `traigocostco.com.mx` activo
- Marca de agua con logo en todas las imágenes
- Seguridad: helmet, rate limiting, regex escapado
- Botón "📋 Copiar pedido" en lightbox (copia "Emiliano yo quiero X en Y" al portapapeles)
- CategoryMatcher con paginación completa (muestra todos los productos sin_categorizar)
- Categoría Refrigeración agregada (🧊)

## Stack
- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express + Mongoose → Railway
- **DB**: MongoDB Atlas (cluster TraigoCostco, usuario: tc_dev)
- **Imágenes**: Cloudinary (cloud: dboqjes1u)
- **Repo**: github.com/Emigori/paginaTraigoCostco

## Credenciales
Todas las credenciales están **únicamente** en Railway (variables de entorno). No se guardan en el repo.
Para pasarlas a una nueva sesión de Claude: compártelas directamente en el chat (conversación privada, no se guarda en el repo).

## Variables de entorno (Railway — backend)
```
MONGO_URI=...
ADMIN_SECRET=...
CLOUDINARY_CLOUD_NAME=dboqjes1u
CLOUDINARY_API_KEY=...   ← key ScrapperR
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://traigocostco.com.mx
```

## Variables de entorno (Vercel — frontend)
```
VITE_API_URL=https://paginatraigocostco-production.up.railway.app
```

## Archivos clave
```
paginaTraigoCostco/
├── backend/src/
│   ├── app.js                         # Express, CORS, helmet, rate limiting
│   ├── constants/categories.js        # CATEGORY_ENUM y CATEGORY_LABELS
│   ├── routes/adminRoutes.js          # CRUD admin (protegido con x-admin-key)
│   ├── routes/productRoutes.js        # GET productos + /novedades
│   ├── controllers/adminController.js
│   └── middlewares/adminAuth.js       # Verifica x-admin-key header
├── frontend/src/
│   ├── App.jsx                        # Página principal + lightbox + botón copiar pedido
│   ├── App.css
│   ├── AdminPanel.jsx                 # Panel de admin (CRUD)
│   ├── CategoryMatcher.jsx            # Matcher visual con paginación completa
│   ├── main.jsx                       # Rutas dinámicas — admin en /:secret
│   └── assets/logo.png
└── CLAUDE.md                          # Documentación técnica completa
```

## Categorías válidas
`ropa`, `farmacia`, `despensa`, `carnes_quesos_salchichas`, `limpieza`, `casa`, `bebidas_te`, `dulces`, `refrigeracion`, `sin_categorizar`

## Modelo Product
`productId` (unique), `name`, `price`, `category` (enum), `imageUrl`, `imagePublicId`, `isActive`, `timestamps`

## API
- `GET /api/health`
- `GET /api/products?category=&search=&page=&limit=`
- `GET /api/products/novedades`
- `GET /api/products/categories`
- `GET /api/admin/products` (requiere x-admin-key)
- `POST /api/admin/products/batch-category` (requiere x-admin-key)
- `POST/PUT/DELETE /api/admin/products/:id` (requiere x-admin-key)

## Flujo scraper de productos (viernes)
1. Configurar `~/Desktop/traigo-costco-productos/config/settings.js` con categoría
2. `node whatsapp_login.js` (abre Chrome con WhatsApp Web)
3. `node index.js` (extrae → descarga → Cloudinary → MongoDB)
4. Si usaste `sin_categorizar`: ir al panel admin → Categorizar nuevos

## Flujo scraper de pedidos
1. `node whatsapp_scraper.js` (en traigo-costco-scraper)
2. `node generar_pedidos.js` → genera `data/pedidos_YYYY-MM-DD.xlsx`
   - Columnas: Categoría | Producto | Nombre | Precio | Comentario
   - Orden cronológico, todo en una hoja
   - Usa MongoDB vía API como diccionario para auto-llenar categoría/precio

## Costos mensuales
- Vercel: **gratis**
- Railway: **~$1-3 USD/mes**
- Cloudinary: **gratis** (plan free)
- MongoDB Atlas: **gratis** (plan M0)
- Dominio GoDaddy: **$199 MXN/año**
