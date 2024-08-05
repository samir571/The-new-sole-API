const express = require('express')
const router = new express.Router()

const  {
  add_new_order,
  update_order,
  delete_order,
  get_all_order,
  get_order_by_id,
} = require("../controller/orders")

const {authenticated,authorizeRoles} = require("../middleware/auth")

//to insert order
router.post("/insert", authenticated, add_new_order); // post method

// to get all order 
router.get("/get/:status", authenticated, get_all_order); // get method


// to update order ADMIN
router.put(
  "/update/:orderId/:deliveryStatusMessage",
  authenticated,
  update_order
); //put method

// to delete order
router.delete("/delete/:id", authenticated, delete_order); //delete method

// to get order by id
router.get("/getById/:id", authenticated, get_order_by_id); // get method


//exporting router

module.exports = router;