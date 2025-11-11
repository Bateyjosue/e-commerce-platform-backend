import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import Product from "../models/Product";
import Order from "../models/Order";
import mongoose from "mongoose";

async function createOrder(req: Request, res: Response) {
  const { description } = req.body;
  let orderProducts = req.body.products;

  if (Array.isArray(req.body)) {
    orderProducts = req.body;
  }

  if (!orderProducts || !Array.isArray(orderProducts) || orderProducts.length === 0) {
    throw new BadRequestError("No order items provided");
  }

  let totalPrice = 0;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of orderProducts) {
      const dbProduct = await Product.findOne({ _id: item.productId }).session(session);
      if (!dbProduct) {
        throw new NotFoundError(`Product with id ${item.productId} not found`);
      }
      if (dbProduct.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${dbProduct.name}`);
      }
      dbProduct.stock -= item.quantity;
      await dbProduct.save({ session });
      totalPrice += dbProduct.price * item.quantity;
    }

    const orderItems = orderProducts.map(item => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    const order = new Order({
      user: req.user.userId,
      products: orderItems,
      totalPrice,
      description,
      status: "pending",
    });

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({ order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function getMyOrders(req: Request, res: Response) {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
}

export { createOrder, getMyOrders };
