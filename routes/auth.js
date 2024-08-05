const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { authenticated} = require("../middleware/auth");

router.post("/isadmin", authController.isAdmin);
router.post("/signup", authController.postSignup);
router.post("/signin", authController.postSignin);
//  Fetching all users available in DB
router.post("/user", authController.allUser);

module.exports = router;
