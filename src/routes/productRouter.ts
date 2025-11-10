import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController";
import authorizePermissions from "../middleware/authorizePermission";
import authenticatedUser from "../middleware/authentication";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(authenticatedUser, authorizePermissions("admin"), createProduct);
productRouter
productRouter
  .route("/:id")
  .get(getSingleProduct)
  .delete(authenticatedUser, authorizePermissions("admin"), deleteProduct)
  .patch(authenticatedUser, authorizePermissions("admin"), updateProduct);
export default productRouter;
