const mongoose = require('mongoose')

// creating tables for cart
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    quantity:{
        type:Number,
        default:1
    }
})

// exporting customer from db
const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;