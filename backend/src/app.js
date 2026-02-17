import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// 404 y errores al final
app.use(notFound);
app.use(errorHandler);

export default app;