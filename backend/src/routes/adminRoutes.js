import { Router } from "express";
import multer from "multer";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadImage,
  adminGetStats,
} from "../controllers/adminController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
  },
});

const router = Router();

// Todas las rutas de admin requieren la clave secreta
router.use(adminAuth);

router.get("/stats", adminGetStats);
router.get("/products", adminListProducts);
router.post("/products", adminCreateProduct);
router.put("/products/:id", adminUpdateProduct);
router.delete("/products/:id", adminDeleteProduct);
router.post("/products/:id/image", upload.single("image"), adminUploadImage);

export default router;
