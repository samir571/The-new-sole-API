const mongoose = require('mongoose')

// creating tables for order
const orderSchema = new mongoose.Schema({
  deliveryStatusMessage: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  orderedDate: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },

  totalPrice: {
    type: Number,
  },

  orderedQty: {
    type: Number,
  },


});
// exporting order from db

// const orderScheme = mongoose.model("Order", orderSchema);
// module.exports = orderScheme;
module.exports = mongoose.model("Order", orderSchema);