import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product";
import { BadRequestError, NotFoundError } from "../errors";
import { v2 as cloudinary } from "cloudinary";
import DatauriParser from "datauri/parser";
import path from "path";
import { Document } from "mongoose";
import {
  sendSuccessResponse,
  sendPaginatedResponse,
} from "../utils/response";
import redisClient from "../utils/redis";

interface IProduct extends Document {
  imagePublicId?: string;
  deleteOne(): Promise<this>;
}

const parser = new DatauriParser();

// Helper to format buffer to data URI
const formatImage = (file: any) => {
  const fileExtension = path.extname(file.name).toString();
  return parser.format(fileExtension, file.data).content;
};

async function uploadProductImageToCloudinary(
  req: Request,
): Promise<{ secure_url: string; public_id: string } | undefined> {
  if (req.files && req.files.image) {
    const productImage = Array.isArray(req.files.image)
      ? req.files.image[0]
      : (req.files.image as any);

    if (!productImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please upload only images");
    }

    const maxSize = (1024 * 1024) * 3; // 3MB
    if (productImage.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 3MB");
    }

    const formattedImage = formatImage(productImage);

    if (formattedImage) {
      const result = await cloudinary.uploader.upload(formattedImage, {
        folder: "product_images",
      });
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    }
  }
  return undefined;
}

async function createProduct(req: Request, res: Response) {
  const { userId } = req.user;
  req.body.user = userId;
  req.body.updatedBy = userId;

  const uploadResult = await uploadProductImageToCloudinary(req);
  if (uploadResult) {
    req.body.image = uploadResult.secure_url;
    req.body.imagePublicId = uploadResult.public_id;
  }

  const product = await Product.create(req.body);

  // flushing all keys
  try {
    await redisClient.flushAll();
  } catch (error) {
    console.error("Redis flushAll error after create:", error);
  }

  sendSuccessResponse(
    res,
    "Product created successfully.",
    product,
    StatusCodes.CREATED,
  );
}

async function getAllProducts(req: Request, res: Response) {
  // 1. Create a unique cache key from the query parameters
  const cacheKey = `products:${JSON.stringify(req.query)}`;

  // 2. Check the cache first
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const { products, page, count, totalProducts } = JSON.parse(cachedData);
      return sendPaginatedResponse(
        res,
        "Products retrieved successfully (from cache).",
        products,
        page,
        count,
        totalProducts,
      );
    }
  } catch (error) {
    // If Redis fails, log the error and proceed to fetch from the database
    console.error("Redis GET error:", error);
  }

  // 3. CACHE MISS: If not in cache, query the database
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const queryObject: any = {};
  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  // Execute queries
  const products = await Product.find(queryObject)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalProducts = await Product.countDocuments(queryObject);

  // 4. Store the fresh data in Redis before sending the response
  try {
    const cacheData = JSON.stringify({
      products,
      page,
      count: products.length,
      totalProducts,
    });
    // Set with a 10-minute expiration
    await redisClient.set(cacheKey, cacheData, { EX: 600 });
  } catch (error) {
    console.error("Redis SET error:", error);
  }

  // 5. Send the response from the database query
  sendPaginatedResponse(
    res,
    "Products retrieved successfully.",
    products,
    page,
    products.length,
    totalProducts,
  );
}

async function getSingleProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }
  sendSuccessResponse(res, "Product retrieved successfully.", product);
}

async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  req.body.updatedBy = req.user.userId;

  const productToUpdate = (await Product.findOne({ _id: id })) as IProduct | null;
  if (!productToUpdate) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  if (req.files && req.files.image && productToUpdate.imagePublicId) {
    await cloudinary.uploader.destroy(productToUpdate.imagePublicId);
  }

  const uploadResult = await uploadProductImageToCloudinary(req);
  if (uploadResult) {
    req.body.image = uploadResult.secure_url;
    req.body.imagePublicId = uploadResult.public_id;
  }

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  // Invalidate cache by flushing all keys
  try {
    await redisClient.flushAll();
  } catch (error) {
    console.error("Redis flushAll error after update:", error);
  }

  sendSuccessResponse(res, "Product updated successfully.", updatedProduct);
}

async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  const product = (await Product.findOne({ _id: id })) as IProduct | null;
  if (!product) {
    throw new NotFoundError(`No product found with id ${id}`);
  }

  if (product.imagePublicId) {
    await cloudinary.uploader.destroy(product.imagePublicId);
  }

  await product.deleteOne();

  // Invalidate cache by flushing all keys
  try {
    await redisClient.flushAll();
  } catch (error) {
    console.error("Redis flushAll error after delete:", error);
  }

  sendSuccessResponse(res, "Product deleted successfully.", null);
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
