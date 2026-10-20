import { Product } from "../models/Product.js";
import { prepareProduct, rankProducts } from "../helpers/searchQuery.js";

// Caché en memoria de productos activos para el buscador (el catálogo es
// chico, así que buscar en memoria es rápido y permite tolerar errores de
// dedo y ordenar por relevancia). Se refresca cada 60 s.
const CACHE_TTL_MS = 60 * 1000;
let cache = { at: 0, items: [] };

async function getActiveProducts() {
  if (Date.now() - cache.at < CACHE_TTL_MS) return cache.items;
  const docs = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  cache = { at: Date.now(), items: docs.map(prepareProduct) };
  return cache.items;
}

export function invalidateSearchCache() {
  cache.at = 0;
}

export const listProducts = async (req, res, next) => {
  try {
    const category = req.query.category ?? null;
    const search = (req.query.search ?? "").trim() || null;

    const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit ?? "24", 10)));

    let items;
    let total;

    if (search) {
      let pool = await getActiveProducts();
      if (category) pool = pool.filter((p) => p.category === category);
      const ranked = rankProducts(pool, search);
      total = ranked.length;
      items = ranked
        .slice((page - 1) * limit, page * limit)
        .map(({ _words, _norm, ...p }) => p);
    } else {
      const filter = { isActive: true };
      if (category) filter.category = category;
      [items, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);
    }

    return res.json({
      ok: true,
      data: {
        items,
        meta: {
          count: items.length,
          total,
          page,
          limit,
          category,
          search,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
