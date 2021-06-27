const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          success: false,
          error: "Order Details Not Found.",
        });
      }

      req.order = order;
      next();
    });
};

exports.getOrder = (req, res) => {
  return res.json({
    success: true,
    message: "Order Retrieved Successfully.",
    order: req.order,
  });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err || !order) {
      return res.status(400).json({
        success: false,
        error: "Failed To Place Order.",
      });
    }

    return res.json({
      success: true,
      message: "Order Created Successfully.",
      order,
    });
  });
};

exports.getUserOrders = (req, res) => {
  let userId = req.profile._id;
  Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          success: false,
          error: "Orders Not Found.",
        });
      }
      return res.json({
        success: true,
        message: "Orders Retrieved Successfully.",
        orders: orders,
      });
    });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          success: false,
          error: "Orders Not Found.",
        });
      }
      return res.json({
        success: true,
        message: "Orders Retrieved Successfully.",
        orders: orders,
      });
    });
};

exports.getOrderStatus = (req, res) => {
  return res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, updated) => {
      if (err || !updated) {
        return res.status(400).json({
          success: false,
          error: "Unable To Update Order Status.",
        });
      }

      return res.json({
        success: true,
        message: "Order Status Updated Successfully.",
        order: updated,
      });
    }
  );
};
