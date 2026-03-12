import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";
import { upload, uploadImages } from "../config/upload";

const productRoutes = Router();

// GET
productRoutes.get("/", productController.getAllProducts);
productRoutes.get("/my", requireAuth(), productController.getMyProducts);
productRoutes.get("/:id", productController.getProductById);

// POST
productRoutes.post(
  "/upload",
  requireAuth(),
  upload.array("images", 4),
  uploadImages,
); // must be before "/"
productRoutes.post("/", requireAuth(), productController.createProduct);

// PUT / DELETE
productRoutes.put("/:id", requireAuth(), productController.updateProduct);
productRoutes.delete("/:id", requireAuth(), productController.deleteProduct);

export default productRoutes;
