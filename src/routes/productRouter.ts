import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController";
import { authenticatedUser, authorizePermissions } from "../middleware";

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security: [ { "bearerAuth": [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'Wireless Headphones' }
 *               price: { type: number, example: 99.99 }
 *               description: { type: string, example: 'High-quality wireless headphones with noise cancellation.' }
 *               category: { type: string, example: 'Electronics' }
 *               stock: { type: number, example: 150 }
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional product image file (max 1MB).
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
productRouter
  .route("/")
  .get(getAllProducts)
  .post(authenticatedUser, authorizePermissions("admin"), createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not Found
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     security: [ { "bearerAuth": [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The product ID.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'Wireless Headphones' }
 *               price: { type: number, example: 99.99 }
 *               description: { type: string, example: 'High-quality wireless headphones with noise cancellation.' }
 *               category: { type: string, example: 'Electronics' }
 *               stock: { type: number, example: 150 }
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional product image file (max 1MB).
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Not Found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security: [ { "bearerAuth": [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Not Found
 */
productRouter
  .route("/:id")
  .get(getSingleProduct)
  .delete(authenticatedUser, authorizePermissions("admin"), deleteProduct)
  .patch(authenticatedUser, authorizePermissions("admin"), updateProduct);

export default productRouter;
