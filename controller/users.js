const userModel = require("../models/users");
const productModel = require("../models/products");
const bcrypt = require("bcryptjs");
const { populate } = require("../models/users");
const cloudinary = require('../middleware/cloudinary.js')

class User {
  async getAllUser(req, res) {
    try {
      let Users = await userModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Users) {
        return res.json({ Users });
      }
    } catch (err) {
      console.log(err);
    }
  }

 async userProfile(req, res){
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      address:user.address,
      phoneNumber: user.phoneNumber,
      userImage: user.userImage,
    };

    res.status(200).json({
      success: true,
      message: "User get success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  async postAddUser(req, res) {

    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newUser = new userModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newUser.save();
        if (save) {
          return res.json({ success: "User created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

//update profile only
async updateProfileData(req, res){
  console.log(req.body);
  const user = await userModel.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found!",
    });
  }
  try {
    const { name, email, phoneNumber, address} = req.body;
    await userModel.findByIdAndUpdate(
      req.user._id,
      { name, email, phoneNumber, address},
      { new: true, runValidators: true, useFindAndModify: false }
    );
    const userData = await userModel.findById(req.user._id);
    console.log("data =>>>>" + userData);
    res.status(200).json({
      success: true,
      message: "user update Successfully!",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update profile with image
async updateProfileWithImage(req, res) {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found!",
    });
  }
  const { name, email, phoneNumber, address } = req.body;
  try {
    
    const formImage = req.files.userImage;
    const imagePath = formImage.tempFilePath;
    if (
      formImage.mimetype == "image/png" ||
      formImage.mimetype == "image/jpg" ||
      formImage.mimetype == "application/octet-stream" ||
      formImage.mimetype == "image/jpeg"
    ) {
      const avatar = await cloudinary.upload_image(imagePath, "User");
      console.log(avatar)
      await userModel.findByIdAndUpdate(
        userId,
        { name, email, phoneNumber, address, userImage: avatar },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      const userData = await userModel.findById(userId);
      res.status(200).json({
        success: true,
        message: "user update Successfully!",
        data: userData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



  // async postEditUser(req, res) {
  //   let { uId, name, phoneNumber } = req.body;
  //   if (!uId || !name || !phoneNumber) {
  //     return res.json({ message: "All filled must be required" });
  //   } else {
  //     let currentUser = userModel.findByIdAndUpdate(uId, {
  //       name: name,
  //       phoneNumber: phoneNumber,
  //       updatedAt: Date.now(),
  //     });
  //     currentUser.exec((err, result) => {
  //       if (err) console.log(err);
  //       return res.json({ success: "User updated successfully" });
  //     });
  //   }
  // }

  async getDeleteUser(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentUser = userModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentUser.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "User updated successfully" });
      });
    }
  }

  // async changePassword(req, res) {
  //   let { uId, oldPassword, newPassword } = req.body;
  //   if (!uId || !oldPassword || !newPassword) {
  //     return res.json({ message: "All filled must be required" });
  //   } else {
  //     const data = await userModel.findOne({ _id: uId });
  //     if (!data) {
  //       return res.json({
  //         error: "Invalid user",
  //       });
  //     } else {
  //       const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
  //       if (oldPassCheck) {
  //         newPassword = bcrypt.hashSync(newPassword, 10);
  //         let passChange = userModel.findByIdAndUpdate(uId, {
  //           password: newPassword,
  //         });
  //         passChange.exec((err, result) => {
  //           if (err) console.log(err);
  //           return res.json({ success: "Password updated successfully" });
  //         });
  //       } else {
  //         return res.json({
  //           error: "Your old password is wrong!!",
  //         });
  //       }
  //     }
  //   }
  // }
  async change_password (req, res)  {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    const user = await userModel.findOne({ _id: req.user.id }).select("+password");
    console.log(User);
    const validLogin = await bcrypt.compare(oldPassword, user.password);
    console.log(validLogin);
    if (validLogin) {
      const salt = await bcrypt.genSalt(10);
      // Create new password
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Invalid Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  // res.end();
};

  async save_product_to_wishlist(req, res) {
    try {
        const product = await productModel.findOne({ _id: req.params.productId })
        const user = await userModel.findOne({ _id: req.user._id}).select("wishlistProduct")
        console.log(user.wishlistProduct)
        if (product) {
          if (user.wishlistProduct.includes(product._id)) {
                user.wishlistProduct.pull(product._id)
                await user.save()
            
              res.status(200).json({
              success: true,
              message: "product Removed",
        });
            } else {
                user.wishlistProduct.push(product._id)
                await user.save()
                res.status(200).json({
                success: true,
                 message: "product Added",
       });
            }
        } else {
          res.status(500).json({
      success: false,
      message: "Product Not Found",
          });
          
        }
    } catch (error) {
        console.log(error)
         res.status(500).json({
      success: false,
      message: "Something went wrong",
          });
    }
    res.end()
  }

  async get_user_wishlist_product(req, res) {
    console.log(req.params);
    try {
      
      const data = await userModel.findById(req.user._id).populate('wishlistProduct');
      const favs = await Promise.all(data.wishlistProduct.map(product => product.populate('productCategory')));

      res.status(200).json({
      success: true,
        message: "User productModel Fetched",
      data:favs
          });
    } catch (error) {
        console.log(error)
        res.status(500).json({
      success: false,
      message: "Something went wrong",
          });
    }
    res.end()
}
}

const ordersController = new User();
module.exports = ordersController;
