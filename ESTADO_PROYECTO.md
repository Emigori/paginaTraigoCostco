# TraigoCostco — Estado del proyecto

## ¿Qué es esto?
Página web para el grupo de ventas TraigoCostco: se traen productos de Costco Guadalajara a Ciudad Guzmán. Se cobran $40 por artículo. El grupo de WhatsApp tiene más de 1,000 personas.

## URLs
- **Página pública**: https://pagina-traigo-costco.vercel.app (funciona ahorita)
- **Dominio comprado**: traigocostco.com.mx (pendiente de conectar DNS, ver abajo)
- **Panel de admin**: https://pagina-traigo-costco.vercel.app/tcadmin7k2m
- **Backend API**: https://paginatraigocostco-production.up.railway.app

## Estado actual ✅
- Página desplegada en Vercel (frontend)
- Backend desplegado en Railway (Express + MongoDB Atlas)
- Imágenes en Cloudinary
- Panel de admin funcionando (URL secreta: `/tcadmin7k2m`)
- Sección Novedades (últimos 30 productos) + badge NUEVO en productos recientes
- Dominio `traigocostco.com.mx` comprado en GoDaddy

## ⚠️ Único pendiente: conectar dominio
Hay que agregar 2 registros DNS en GoDaddy (cuenta suspendida temporalmente):

| Tipo | Nombre | Valor |
|------|--------|-------|
| `A` | `@` | `216.198.79.1` |
| `CNAME` | `www` | `35cb0c0ba94932d5.vercel-dns-017.com.` |

**Pasos:**
1. Entrar a godaddy.com → Mi cuenta → Dominios → `traigocostco.com.mx` → DNS
2. Agregar/editar los dos registros de arriba
3. Guardar y esperar 10-15 minutos
4. Entrar a Vercel → proyecto `pagina-traigo-costco` → Settings → Domains → click "Refresh"
5. Los dos dominios deben quedar en verde ✅

---

## Stack
- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express + Mongoose → Railway
- **DB**: MongoDB Atlas (cluster TraigoCostco)
- **Imágenes**: Cloudinary (cloud: dboqjes1u)
- **Repo**: github.com/Emigori/paginaTraigoCostco

## Credenciales importantes
- Admin URL secreta: `/tcadmin7k2m`
- ADMIN_SECRET: `tcadmin7k2m`
- MongoDB: `mongodb+srv://tc_dev:TcDev2026@traigocostco.1uo0ds8.mongodb.net/`
- Cloudinary cloud: `dboqjes1u`

## Archivos clave
```
paginaTraigoCostco/
├── backend/
│   └── src/
│       ├── app.js                        # Express, CORS, rutas
│       ├── routes/adminRoutes.js         # CRUD admin (protegido con x-admin-key)
│       ├── routes/productRoutes.js       # GET productos + /novedades
│       ├── controllers/adminController.js
│       └── middlewares/adminAuth.js      # Verifica x-admin-key header
├── frontend/
│   └── src/
│       ├── App.jsx                       # Página principal
│       ├── AdminPanel.jsx                # Panel de admin
│       └── assets/logo.png              # ⚠️ Pesa 2MB, comprimir en squoosh.app
└── CLAUDE.md                             # Documentación técnica completa
```

## Variables de entorno

### Railway (backend)
```
MONGO_URI=mongodb+srv://tc_dev:TcDev2026@traigocostco.1uo0ds8.mongodb.net/?appName=TraigoCostco
ADMIN_SECRET=tcadmin7k2m
CLOUDINARY_CLOUD_NAME=dboqjes1u
CLOUDINARY_API_KEY=617396384311981
CLOUDINARY_API_SECRET=wmo600zA0QhXdNlqlD4pCXpyICk
FRONTEND_URL=https://pagina-traigo-costco.vercel.app
```

### Vercel (frontend)
```
VITE_API_URL=https://paginatraigocostco-production.up.railway.app
VITE_ADMIN_SECRET=tcadmin7k2m
```

## Flujo para agregar nueva categoría (scraper)
1. Editar `~/Desktop/traigo-costco-productos/config/settings.js` con la nueva categoría
2. Correr `node index.js` (con WhatsApp Web abierto)
3. Los productos aparecen automáticamente en la página

## Costos mensuales
- Vercel: **gratis**
- Railway: **~$1-3 USD/mes** (tiene $5 USD de crédito incluido)
- Cloudinary: **gratis** (plan free)
- MongoDB Atlas: **gratis** (plan M0)
- Dominio GoDaddy: **$199 MXN/año** (~$17 USD)

## Pendiente menor
- Comprimir logo: `frontend/src/assets/logo.png` pesa 2MB, comprimirlo en squoosh.app a ~200KB y hacer commit+push
