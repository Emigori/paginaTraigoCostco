import mongoose from "mongoose";

import { CATEGORY_ENUM } from "../constants/categories.js";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORY_ENUM,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\/.+/i,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text" });
productSchema.index({ isActive: 1, category: 1 });

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);