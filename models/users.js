const mongoose = require("mongoose");
const jwt =  require('jsonwebtoken')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
    },
  
    phoneNumber: {
      type: String,
    },
    address: {
      type:String,
    },
    userImage: {
      type: String,
      // default: "user.png",
    },
    verified: {
      type: String,
      default: false,
    },
    secretKey: {
      type: String,
      default: null,
    },
    history: {
      type: Array,
      default: [],
    },
      userRole: {
      type: Number,
      default:1,
      required: true,
    },
    wishlistProduct: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      select: false
      }
    ],
  },
  { timestamps: true }
);

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
