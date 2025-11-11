import express from "express";
import {
  createOrder,
  getMyOrders,
} from "../controllers";
import authenticateUser  from "../middleware/authentication";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, getMyOrders);

export default orderRouter;