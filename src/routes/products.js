import express from "express";
import productController from "../controllers/productController.js";
import upload from "../utils/cloudinaryConfig.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();


router
  .route("/")
  .get(productController.getProducts)
  .post(verifyToken, upload.single("image"), productController.createProduct);


router.route("/low-stock").get(productController.getLowStock);


router.route("/count").get(productController.countProducts);


router.route("/price-range").post(productController.getByPriceRange);


router.route("/category/:category").get(productController.getByCategory);


router
  .route("/:id")
  .get(productController.getProductById)
  .put(verifyToken, upload.single("image"), productController.updateProduct)
  .delete(verifyToken, productController.deleteProduct);


router
  .route("/:id/tags")
  .get(productController.getTags)
  .post(verifyToken, productController.addTag)
  .put(verifyToken, productController.updateTag)
  .delete(verifyToken, productController.deleteTag);

export default router;
