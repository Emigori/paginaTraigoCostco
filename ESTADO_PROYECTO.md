# TraigoCostco — Estado del proyecto

## ¿Qué es esto?
Página web para el grupo de ventas TraigoCostco: se traen productos de Costco Guadalajara a Ciudad Guzmán. Se cobran $40 por artículo. El grupo de WhatsApp tiene más de 1,000 personas.

## URLs
- **Página pública**: https://traigocostco.com.mx
- **Backend API**: https://paginatraigocostco-production.up.railway.app
- **Panel de admin**: `traigocostco.com.mx/{ADMIN_SECRET}` — ver Railway

## Estado actual ✅
- Página desplegada en Vercel (frontend)
- Backend desplegado en Railway (Express + MongoDB Atlas)
- Imágenes en Cloudinary (cloud: dboqjes1u, key: ScrapperR)
- Panel de admin funcionando — clave en Railway → `ADMIN_SECRET`
- Sección Novedades + badge NUEVO en productos recientes
- Dominio `traigocostco.com.mx` activo
- Marca de agua con logo en todas las imágenes
- Seguridad: helmet, rate limiting, regex escapado

---

## Stack
- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express + Mongoose → Railway
- **DB**: MongoDB Atlas (cluster TraigoCostco, usuario: tc_dev)
- **Imágenes**: Cloudinary (cloud: dboqjes1u)
- **Repo**: github.com/Emigori/paginaTraigoCostco

## Credenciales
Todas las credenciales están **únicamente** en Railway (variables de entorno). No se guardan en el repo.

Para pasarlas a una nueva sesión de Claude: compártelas directamente en el chat (conversación privada, no se guarda en el repo).

## Variables de entorno (Railway)
```
MONGO_URI=...
ADMIN_SECRET=...
CLOUDINARY_CLOUD_NAME=dboqjes1u
CLOUDINARY_API_KEY=...   ← key ScrapperR
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://traigocostco.com.mx
```

## Variables de entorno (Vercel)
```
VITE_API_URL=https://paginatraigocostco-production.up.railway.app
```

## Archivos clave
```
paginaTraigoCostco/
├── backend/src/
│   ├── app.js                    # Express, CORS, helmet, rate limiting
│   ├── routes/adminRoutes.js     # CRUD admin (protegido con x-admin-key)
│   ├── routes/productRoutes.js   # GET productos + /novedades
│   ├── controllers/adminController.js
│   └── middlewares/adminAuth.js  # Verifica x-admin-key header
├── frontend/src/
│   ├── App.jsx                   # Página principal
│   ├── AdminPanel.jsx            # Panel de admin
│   ├── main.jsx                  # Rutas — admin en /:secret
│   └── assets/logo.png
└── CLAUDE.md                     # Documentación técnica completa
```

## Flujo para agregar nueva categoría (scraper)
1. Editar `~/Desktop/traigo-costco-productos/config/settings.js` con la nueva categoría
2. Correr `node index.js`
3. Los productos aparecen automáticamente en la página
4. ⚠️ Actualizar las keys de Cloudinary en el scraper (ScrapperR)

## Costos mensuales
- Vercel: **gratis**
- Railway: **~$1-3 USD/mes**
- Cloudinary: **gratis** (plan free)
- MongoDB Atlas: **gratis** (plan M0)
- Dominio GoDaddy: **$199 MXN/año**
