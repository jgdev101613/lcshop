import type { Request, Response } from "express";

import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary";

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const products = await queries.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {}
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    const product = await queries.getProductById(productId);

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { title, description, imageUrls, price, category } = req.body;
    if (!title || !description || !imageUrls?.length || !price || !category) {
      res.status(400).json({
        error:
          "Title, Description, at least one Image, Price and Category are required",
      });
      return;
    }
    if (
      !Array.isArray(imageUrls) ||
      imageUrls.length < 1 ||
      imageUrls.length > 4
    ) {
      res.status(400).json({ error: "Between 1 and 4 images are required" });
      return;
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrls,
      price,
      category,
      userId,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    const allowedFields = [
      "title",
      "description",
      "imageUrls",
      "price",
      "category",
      "subCategory",
      "location",
      "status",
      "stock",
    ];

    const updateData: any = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    const existingProduct = await queries.getProductById(productId);
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can only update your own products" });
      return;
    }

    // Delete removed images from Cloudinary
    if (updates.imageUrls && existingProduct.imageUrls) {
      const removedUrls = existingProduct.imageUrls.filter(
        (url: string) => !updates.imageUrls.includes(url),
      );

      for (const url of removedUrls) {
        const publicId = url
          .split("/upload/")[1] // get everything after /upload/
          .replace(/^v\d+\//, "") // strip version like v1234567890/
          .replace(/\.[^/.]+$/, ""); // strip file extension

        await cloudinary.uploader.destroy(publicId);
      }
    }

    const product = await queries.updateProduct(productId, updateData);

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;

    const existingProduct = await queries.getProductById(productId);
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can only delete your own products" });
      return;
    }

    // Delete all product images from Cloudinary
    if (existingProduct.imageUrls?.length) {
      for (const url of existingProduct.imageUrls) {
        const publicId = url
          .split("/upload/")[1] // get everything after /upload/
          .replace(/^v\d+\//, "") // strip version like v1234567890/
          .replace(/\.[^/.]+$/, ""); // strip file extension

        await cloudinary.uploader.destroy(publicId);
      }
    }

    await queries.deleteProduct(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
