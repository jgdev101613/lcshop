import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const productRoutes = Router();

// GET /api/products => Get all products
productRoutes.get("/", productController.getAllProducts);
productRoutes.get("/my", requireAuth(), productController.getMyProducts);
productRoutes.get("/:id", productController.getProductById);
productRoutes.post("/", requireAuth(), productController.createProduct);
productRoutes.put("/:id", requireAuth(), productController.updateProduct);
productRoutes.delete("/:id", requireAuth(), productController.deleteProduct);

export default productRoutes;
