# TraigoCostco — Plataforma de catálogo de productos

**Sitio en producción:** [traigocostco.com.mx](https://traigocostco.com.mx) · **Repo:** [github.com/Emigori/paginaTraigoCostco](https://github.com/Emigori/paginaTraigoCostco)

---

## Descripción

Plataforma web full-stack construida para un negocio real de reventas de Costco con más de **1,000 clientes activos** en Ciudad Guzmán, Jalisco. El negocio operaba completamente por WhatsApp; la página reemplaza el proceso manual de mostrar productos y permite a los clientes explorar el catálogo en cualquier momento sin depender de mensajes.

---

## Características principales

- **Catálogo dinámico** con filtrado por categoría, buscador en tiempo real y paginación infinita
- **Lightbox de producto** con imagen ampliada y acceso directo al grupo de WhatsApp
- **Sección Novedades** que muestra los últimos 30 productos agregados, con badge automático en productos recientes (< 7 días)
- **Marca de agua** con logo propio superpuesta en todas las imágenes vía CSS, sin modificar los archivos originales
- **Panel de administración** con URL secreta para operaciones CRUD: crear, editar, activar/desactivar y eliminar productos, asignar imágenes desde Cloudinary
- **Pipeline de carga de productos**: scraper en Node.js que lee mensajes de WhatsApp, extrae nombre/precio de los captions, sube imágenes a Cloudinary y registra los productos en MongoDB
- **Diseño responsive** optimizado para móvil (principal dispositivo de los clientes)
- **Pantalla de mantenimiento** configurable desde el panel de admin sin tocar el código

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express (ES Modules) |
| Base de datos | MongoDB Atlas + Mongoose |
| Imágenes | Cloudinary (transformaciones dinámicas vía URL) |
| Deploy frontend | Vercel |
| Deploy backend | Railway |
| Control de versiones | Git + GitHub |

---

## Arquitectura

```
Frontend (React/Vite) → Vercel CDN
        ↕ REST API
Backend (Express)     → Railway
        ↕ Mongoose
MongoDB Atlas         → Cloud DB
        ↕ SDK
Cloudinary            → Almacenamiento y transformación de imágenes
```

- El frontend consume una API REST con endpoints para listar productos (`?category`, `?search`, paginación), novedades y categorías disponibles
- Las imágenes se sirven con transformaciones de Cloudinary en la URL (`w_600,c_limit,q_auto,f_auto`) para optimizar el peso sin almacenar múltiples versiones
- El panel de admin está protegido por un header `x-admin-key` verificado en middleware de Express

---

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Listado con filtros: `category`, `search`, `page`, `limit` |
| `GET` | `/api/products/novedades` | Últimos 30 productos |
| `GET` | `/api/products/categories` | Categorías disponibles |
| `POST` | `/api/admin/products` | Crear producto *(requiere auth)* |
| `PUT` | `/api/admin/products/:id` | Editar producto *(requiere auth)* |
| `DELETE` | `/api/admin/products/:id` | Desactivar producto *(requiere auth)* |

---

## Impacto real

- Más de **1,000 clientes** con acceso al catálogo sin necesidad de WhatsApp
- Reducción del tiempo de gestión: los productos nuevos aparecen automáticamente tras correr el scraper
- El dueño administra todo el inventario desde el panel sin conocimientos técnicos

---

## Instalación local

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:4000

# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Variables de entorno requeridas en `backend/.env`:
```
MONGO_URI=...
ADMIN_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=...
```
