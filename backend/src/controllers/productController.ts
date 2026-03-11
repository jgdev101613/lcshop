import type { Request, Response } from "express";

import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

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
  } catch (error) {
    console.error("Error getting product:", error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, imageUrl, price, category } = req.body;

    if (!title || !description || !imageUrl || !price || !category) {
      res.status(400).json({
        error: "Title, Description, Image Url, Price and Category are required",
      });
      return;
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
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
      "imageUrl",
      "price",
      "category",
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
      res.status(403).json({ error: "You can only update your own products" });
      return;
    }

    const product = queries.deleteProduct(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
