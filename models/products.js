const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productSold: {
      type: Number,
      default: 0,
    },
    productQuantity: {
      type: Number,
      default: 0,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    productImageUrlList: {
      type: Array,
    },
    productOffer: {
      type: String,
      default: null,
    },
    productStatus: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
