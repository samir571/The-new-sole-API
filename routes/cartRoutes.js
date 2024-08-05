const express = require('express')
// const authorize = require("../middleware/auth")
const cartController = require("../controller/cartController")
const {authenticated,authorizeRoles} = require("../middleware/auth")

// bulk export of routes
const router = new express.Router()

//to insert cart
router.post('/insert/:productId/:quantity',authenticated, cartController.add_new_cart) // post method

// to update cart
router.put('/update/:id/:quantity', cartController.update_cart) //put method

// to delete cart
router.delete('/delete/:productId', authenticated,cartController.delete_cart) //delete method

// to get all cart
router.get('/getCart',authenticated, cartController.get_all_cart) // get method


//exporting router
module.exports = router