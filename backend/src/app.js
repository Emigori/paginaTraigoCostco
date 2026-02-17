import express from "express";
import cors from "cors";

const app = express();

// Permite que el frontend le pueda pegar a tu backend (luego lo restringimos)
app.use(cors());

// Permite recibir JSON en requests (POST/PUT futuro)
app.use(express.json());

// Ruta de prueba: “¿está vivo el backend?”
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

export default app;