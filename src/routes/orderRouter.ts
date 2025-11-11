import express from "express";
import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController";
import { authenticatedUser } from "../middleware";

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - productId
 *                 - quantity
 *               properties:
 *                 productId: { type: string, example: '60c72b2f9b1d8c001f8e4cde' }
 *                 quantity: { type: number, example: 2 }
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request (e.g., insufficient stock)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */

orderRouter
  .route("/")
  .post(authenticatedUser, createOrder)
  .get(authenticatedUser, getMyOrders);

export default orderRouter;
