import Order from "../models/orderModel.js";
import Product from "../models/productModel.js"; 
import publish from "../services/publish.js";

export const listOrders = async (req, res, next) => {
    /*
    #swagger.tags = ["Orders"]
    #swagger.summary = "List all orders with pagination"
    #swagger.responses[200]
    #swagger.security = [{ "BearerAuth": [] }]
    */
    try {
      const page = parseInt(req.query._page) || 1;
      const size = parseInt(req.query._size) || 10;
      const sort = req.query._sort || 'createdAt';
      const order = req.query._order === 'desc' ? -1 : 1;
  
      const offset = (page - 1) * size;
  
      const orders = await Order.find()
        .skip(offset)
        .limit(size)
        .sort({ [sort]: order })
        .populate("user", "name email")
        .populate("products.productId", "name price");
  
      const totalData = await Order.countDocuments();
      const totalPages = Math.ceil(totalData / size);
  
      res.ok(res.hateos_list("orders", orders, totalPages));
    } catch (err) {
      next(err);
    }
  };

export const createOrder = async (req, res, next) => {
  /*
  #swagger.tags = ["Orders"]
  #swagger.summary = "Create a new order"
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: { $ref: "#/components/schemas/Order" }
          }
      }
  }
  #swagger.responses[201]
  #swagger.security = [{ "BearerAuth": [] }]
  */
  try {
    const { userId, products } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.badRequest({ message: "Invalid order payload" });
    }

    // Busca os produtos no banco para calcular o total
    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== products.length) {
      return res.badRequest({ message: "One or more products are invalid" });
    }

    const processedProducts = products.map((item) => {
      const product = dbProducts.find((p) => p._id.toString() === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        value: product.price,
      };
    });

    const newOrder = new Order({
      user: userId,
      products: processedProducts,
    });

    await newOrder.save();

    await publish("debt", {
        userId,
        orderId: newOrder._id,
        products: processedProducts,
        callback: {
            href: `${process.env.SERVER}/api/debtors`,
            method: "POST",
            token: newOrder.token,
        }
      });

    res.created({ message: "Order created successfully", orderId: newOrder._id });
  } catch (err) {
    next(err);
  }
};

export const changeOrderStatus = async (req, res, next) => {
    /*
    #swagger.tags = ["Orders"]
    #swagger.summary = "Change order status"
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Order" }
            }
        }
    }
    #swagger.responses[204]
    #swagger.security = [{ "BearerAuth": [] }]
    */
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const token = req.header("x-api-key");

        if (!status) {
            return res.forbidden();
        }
    
        const order = await Order.findOne({
            _id: orderId,
            status: "pending",
            token: token,
        });
        if (!order){
            return res.unauthorized();
        }
    
        order.status = status;
        await order.save();
    
        res.no_content();
    } catch (err) {
        next(err);
    }
}
