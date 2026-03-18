export const listProducts = async (req, res, next) => {
  try {
    const category = req.query.category ?? null;
    const search = req.query.search ?? null;

    const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit ?? "24", 10)));

    // Fase 1 (sin DB): contrato final, items vacío
    return res.json({
      ok: true,
      data: {
        items: [],
        meta: {
          count: 0,
          total: 0,
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