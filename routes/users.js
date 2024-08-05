const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");
const { authenticated } = require("../middleware/auth");

router.get("/all-user",authenticated,usersController.getAllUser);

router.get("/singleProfile",authenticated, usersController.userProfile);

router.post("/add-user", usersController.postAddUser);
router.put("/update/profile-data",authenticated, usersController.updateProfileData);
router.put("/update/profile-all",authenticated, usersController.updateProfileWithImage);
router.post("/delete-user", usersController.getDeleteUser);

router.post("/change-password",authenticated, usersController.change_password);

router.get("/wishlistProduct",  authenticated, usersController.get_user_wishlist_product);
router.post("/wishlistProduct/:productId", authenticated,usersController.save_product_to_wishlist)

module.exports = router;
