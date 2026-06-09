import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// ── Seguridad: headers HTTP seguros
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
  "https://traigocostco.com.mx",
  "https://www.traigocostco.com.mx",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    callback(new Error(`CORS bloqueado: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));

// ── Rate limiting: endpoints públicos (100 req / 15 min por IP)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Demasiadas peticiones, intenta más tarde." },
});

// ── Rate limiting: admin (20 req / 15 min por IP — más estricto)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Demasiados intentos de acceso al admin." },
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", publicLimiter, productRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;