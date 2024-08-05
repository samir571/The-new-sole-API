const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const multer = require("multer");
const {authenticated,authorizeRoles} = require("../middleware/auth")


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/all-product", productController.getAllProduct);

router.post("/add-product",authenticated, productController.postAddProduct);
router.post("/uploadImage", productController.uploadImage)
router.post("/edit-product", upload.any(), productController.postEditProduct);
router.post("/delete-product", productController.getDeleteProduct);
router.post("/single-product", productController.getSingleProduct);

router.post("/product-by-category", productController.getProductByCategory);

router.post("/product-by-price", productController.getProductByPrice);

router.post("/add-review",authenticated, productController.postAddReview);
router.post("/delete-review",authenticated, productController.deleteReview);

router.get("/:categoryId", productController.getAllCategoryProduct);


module.exports = router;
