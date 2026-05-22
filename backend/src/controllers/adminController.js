import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/Product.js";
import { CATEGORY_ENUM } from "../constants/categories.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── GET /api/admin/products ──────────────────────────────────────────────────
export const adminListProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit ?? "50", 10)));
    const category = req.query.category || null;
    const search = req.query.search || null;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ ok: true, data: { items, meta: { total, page, limit } } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/products ─────────────────────────────────────────────────
export const adminCreateProduct = async (req, res, next) => {
  try {
    const { name, price, category, imageUrl, imagePublicId } = req.body;

    if (!name || !price || !category || !imageUrl) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios: name, price, category, imageUrl" });
    }
    if (!CATEGORY_ENUM.includes(category)) {
      return res.status(400).json({ ok: false, error: `Categoría inválida. Opciones: ${CATEGORY_ENUM.join(", ")}` });
    }

    const productId = `MANUAL-${Date.now()}`;
    const product = await Product.create({
      productId,
      name: name.trim(),
      price: parseFloat(price),
      category,
      imageUrl,
      imagePublicId: imagePublicId || "",
      isActive: true,
    });

    res.status(201).json({ ok: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/admin/products/:id ──────────────────────────────────────────────
export const adminUpdateProduct = async (req, res, next) => {
  try {
    const { name, price, category, imageUrl, imagePublicId, isActive } = req.body;

    if (category && !CATEGORY_ENUM.includes(category)) {
      return res.status(400).json({ ok: false, error: `Categoría inválida.` });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (price !== undefined) updates.price = parseFloat(price);
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (imagePublicId !== undefined) updates.imagePublicId = imagePublicId;
    if (isActive !== undefined) updates.isActive = isActive;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    res.json({ ok: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/admin/products/:id ───────────────────────────────────────────
export const adminDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );
    if (!product) return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    res.json({ ok: true, message: "Producto desactivado correctamente" });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/products/:id/image ──────────────────────────────────────
export const adminUploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: "No se recibió ninguna imagen" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ ok: false, error: "Producto no encontrado" });

    const folder = `costco/${product.category}`;

    // Subir buffer a Cloudinary mediante stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, use_filename: false, resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Actualizar producto con la nueva imagen
    product.imageUrl = uploadResult.secure_url;
    product.imagePublicId = uploadResult.public_id;
    await product.save();

    res.json({ ok: true, data: { imageUrl: uploadResult.secure_url, imagePublicId: uploadResult.public_id } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/products/batch-category ──────────────────────────────────
export const adminBatchCategory = async (req, res, next) => {
  try {
    const { updates } = req.body; // [{ id, category }, ...]
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ ok: false, error: "updates debe ser un array no vacío" });
    }

    const ops = updates.map(({ id, category }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { category, isActive: category !== "sin_categorizar" } },
      },
    }));

    const result = await Product.bulkWrite(ops);
    res.json({ ok: true, data: { modified: result.modifiedCount } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
export const adminGetStats = async (req, res, next) => {
  try {
    const total = await Product.countDocuments({ isActive: true });
    const byCategory = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ ok: true, data: { total, byCategory } });
  } catch (err) {
    next(err);
  }
};
