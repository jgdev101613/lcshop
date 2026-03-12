import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import cloudinary from "./cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          {
            width: 1200,
            crop: "limit",
          },
          {
            quality: "auto",
          },
          {
            fetch_format: "auto",
          },
          {
            flags: "progressive",
          },
          {
            strip: true,
          },
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    if (files.length > 4) {
      return res.status(400).json({ error: "Maximum 4 images allowed" });
    }

    // Fix: This code block spikes memory usage because it runs all upload simultaneously.
    // const uploadPromises = files.map((file) =>
    //   uploadToCloudinary(file.buffer, `lcstore/products/${userId}`),
    // );

    // const imageUrls = await Promise.all(uploadPromises);

    const imageUrls: string[] = [];
    for (const file of files) {
      const url = await uploadToCloudinary(
        file.buffer,
        `lcstore/products/${userId}`,
      );
      imageUrls.push(url);
    }

    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};
