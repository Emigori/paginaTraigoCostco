import { Product } from "../models/Product.js";
import { buildSearchFilters } from "../helpers/searchQuery.js";

export const listProducts = async (req, res, next) => {
  try {
    const category = req.query.category ?? null;
    const search = req.query.search ?? null;

    const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit ?? "24", 10)));

    const base = { isActive: true };
    if (category) base.category = category;

    const searchFilters = search ? buildSearchFilters(search) : null;
    let filter = searchFilters ? { ...base, ...searchFilters.and } : base;

    // Si buscar TODAS las palabras no da nada, se intenta con ALGUNA palabra
    if (searchFilters?.or && (await Product.countDocuments(filter)) === 0) {
      filter = { ...base, ...searchFilters.or };
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

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