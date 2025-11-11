import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product";
import { BadRequestError, NotFoundError } from "../errors";
import { v2 as cloudinary } from "cloudinary";
import DatauriParser from "datauri/parser";
import path from "path";
import { Document } from "mongoose";

// Define an interface for the Product document for type safety
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

    const maxSize = 1024 * 1024; // 1MB
    if (productImage.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 1MB");
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
  res.status(StatusCodes.CREATED).json({ product });
}

async function getAllProducts(req: Request, res: Response) {
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const queryObject: any = {};
  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = Product.find(queryObject).skip(skip).limit(limit);

  const products = await result;

  const totalProducts = await Product.countDocuments(queryObject);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(StatusCodes.OK).json({
    currentPage: page,
    pageSize: products.length,
    totalPages,
    totalProducts,
    products,
  });
}

async function getSingleProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }
  res.status(StatusCodes.OK).json({ product });
}

async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  req.body.updatedBy = req.user.userId;

  const productToUpdate = (await Product.findOne({ _id: id })) as IProduct | null;
  if (!productToUpdate) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  // If a new image is uploaded, delete the old one first
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

  res.status(StatusCodes.OK).json({ product: updatedProduct });
}

async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  const product = (await Product.findOne({ _id: id })) as IProduct | null;
  if (!product) {
    throw new NotFoundError(`No product found with id ${id}`);
  }

  // Delete image from Cloudinary before deleting the product
  if (product.imagePublicId) {
    await cloudinary.uploader.destroy(product.imagePublicId);
  }

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
