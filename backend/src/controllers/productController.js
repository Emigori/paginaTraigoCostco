import { Product } from "../models/Product.js";

export const listProducts = async (req, res, next) => {
  try {
    const category = req.query.category ?? null;
    const search = req.query.search ?? null;

    const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit ?? "24", 10)));

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

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