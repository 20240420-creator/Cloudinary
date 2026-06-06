import express from "express";
import productController from "../controllers/productController.js";
import upload from "../utils/cloudinaryConfig.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================================
// CRUD BASICO
// =============================================

// GET  /api/products         - Obtener todos los productos
// POST /api/products         - Crear producto (con imagen)
router
  .route("/")
  .get(productController.getProducts)
  .post(verifyToken, upload.single("image"), productController.createProduct);

// GET    /api/products/low-stock  - Productos con poco stock
router.route("/low-stock").get(productController.getLowStock);

// GET    /api/products/count      - Contar productos
router.route("/count").get(productController.countProducts);

// POST   /api/products/price-range - Buscar por rango de precio
router.route("/price-range").post(productController.getByPriceRange);

// GET    /api/products/category/:category - Por categoría
router.route("/category/:category").get(productController.getByCategory);

// GET    /api/products/:id   - Obtener un producto
// PUT    /api/products/:id   - Actualizar producto (con imagen opcional)
// DELETE /api/products/:id   - Eliminar producto
router
  .route("/:id")
  .get(productController.getProductById)
  .put(verifyToken, upload.single("image"), productController.updateProduct)
  .delete(verifyToken, productController.deleteProduct);

// =============================================
// CRUD CON ARRAYS - TAGS
// =============================================

// GET    /api/products/:id/tags        - Ver todos los tags
// POST   /api/products/:id/tags        - Agregar un tag
// PUT    /api/products/:id/tags        - Editar un tag
// DELETE /api/products/:id/tags        - Eliminar un tag
router
  .route("/:id/tags")
  .get(productController.getTags)
  .post(verifyToken, productController.addTag)
  .put(verifyToken, productController.updateTag)
  .delete(verifyToken, productController.deleteTag);

export default router;
