import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product";
import { BadRequestError, NotFoundError } from "../errors";
import path from "path";

async function uploadProductImage(req: Request): Promise<string | undefined> {
  if (req.files && req.files.image) {
    const productImage = Array.isArray(req.files.image)
      ? req.files.image[0]
      : (req.files.image as any);
    if (!productImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please upload only images");
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
      throw new BadRequestError("Please upload image smaller than 1MB");
    }
    const imagePath = path.join(
      __dirname,
      "../public/uploads/" + `${productImage.name}`
    );
    await productImage.mv(imagePath);
    return `/uploads/${productImage.name}`;
  }
  return undefined;
}

async function createProduct(req: Request, res: Response) {
  const { userId } = req.user;
  req.body.user = userId;
  req.body.updatedBy = userId;

  const imagePath = await uploadProductImage(req);
  if (imagePath) {
    req.body.image = imagePath;
  }

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
}

async function getAllProducts(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({}).skip(skip).limit(limit);

  const totalProducts = await Product.countDocuments();
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
  const product = await Product.findOne({ _id: id }).populate("reviews");
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }
  res.status(StatusCodes.OK).json({ product });
}

async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  req.body.updatedBy = req.user.userId;

  const imagePath = await uploadProductImage(req);
  if (imagePath) {
    req.body.image = imagePath;
  }

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  res.status(StatusCodes.OK).json({ product });
}

async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError(`Not product found with id ${id}`);
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
