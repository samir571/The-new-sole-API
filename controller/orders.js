
const Order = require("../models/Order")
const Cart = require("../models/Cart")


class Orders {
  async add_new_order  (req, res) {
    try {
    console.log("===================== First ============");
    
    const userId = req.user._id;
    console.log(userId);
    console.log("===================== url hits ============");
    console.log(userId);
    const cartsData = await Cart.find({ userId }).populate("productId");
    
    console.log("== Cart Data ====");
    console.log(cartsData);

    cartsData.forEach(async (cart) => {
      const order = new Order({
        productId: cart.productId._id,
        userId: cart.userId,
        orderedQty: cart.quantity,
        totalPrice: cart.productId.productPrice * cart.quantity,
      });
      await order.save();
    });
    res.status(200).json({
      success: true,
      message: "Order Placed Successfully!",
    });
    await Cart.deleteMany({ userId });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; // add order

 async update_order (req, res) {
  try {
    const orderId = req.params.orderId;
    let updatedOrder = await Order.updateOne(
      { _id: orderId },
      {
        deliveryStatusMessage: req.params.deliveryStatusMessage,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Order Updated Successfully!",
      // async and await ma return garne tarika
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; //update order
 async  delete_order   (req, res){
  try {
    const orderId = req.params.id;
    const response = await Order.deleteOne({ _id: orderId });
    if (response.deletedCount > 0) {
      res.status(201).json({
        success: true,
        message: "Item Deleted Successfully!",
      });
    } else {
      res.status(201).json({
        success: false,
        message: "This item is not ordered!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}; // delete order

 async  get_all_order  (req, res) {
  try {
    const userId = req.user._id;
    console.log(userId);
    const ordersData = await Order.find({
      userId: userId,
      deliveryStatusMessage: req.params.status,
    }).populate("userId productId");
    res.status(200).json({
      success: true,
      data: ordersData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
  }; // fetch all order
  
 async  get_order_by_id   (req, res) {
  const id = req.params.id;
  try {
    const singleOrderData = await Order.findOne({ _id: id }).populate(
      "userId productId"
    );
    res.status(200).json({
      success: true,
      singleOrderData: singleOrderData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
}; // get order by id
}

const orderController = new Orders();
module.exports = orderController;