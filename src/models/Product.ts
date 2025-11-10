import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: [0, "Price must be a positive number"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      minLength: [10, "Description must be at least 10 characters long"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/defaultImage.jpeg",
    },
  category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: {
          values: ["office", "kitchen", "bedroom", "Electronics"],
          message: "{VALUE} is not a supported category",
      },
  },
    stock: {
      type: Number,
      required: [true, "Please provide product stock"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("Product", ProductSchema);
