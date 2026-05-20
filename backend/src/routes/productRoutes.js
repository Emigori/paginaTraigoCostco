import { Router } from "express";
import { CATEGORY_ENUM } from "../constants/categories.js";
import { listProducts } from "../controllers/productController.js";
import { Product } from "../models/Product.js";

const router = Router();

// Últimos 30 productos agregados (para sección Novedades)
router.get("/novedades", async (req, res, next) => {
  try {
    const items = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    res.json({ ok: true, data: { items } });
  } catch (err) {
    next(err);
  }
});

router.get("/", (req, res, next) => {
  const categoryRaw = req.query.category ?? null;
  const searchRaw = req.query.search ?? null;

  const category = categoryRaw ? String(categoryRaw).trim() : null;
  const search = searchRaw ? String(searchRaw).trim() : null;

  if (category && !CATEGORY_ENUM.includes(category)) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "INVALID_CATEGORY",
        message: `category debe ser uno de: ${CATEGORY_ENUM.join(", ")}`,
      },
    });
  }

  if (search && search.length < 2) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "INVALID_SEARCH",
        message: "search debe tener al menos 2 caracteres",
      },
    });
  }

  req.query.category = category;
  req.query.search = search;

  return listProducts(req, res, next);
});

router.get("/categories", (req, res) => {
  res.json({ ok: true, data: CATEGORY_ENUM });
});

export default router;