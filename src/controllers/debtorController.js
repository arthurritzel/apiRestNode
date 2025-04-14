import Debtor from "../models/debtorModel.js";
import Order from "../models/orderModel.js";
import publish from "../services/publish.js";

/**
 * Cria um novo devedor
 */
export const createDebtor = async (req, res, next) => {
  /*
  #swagger.tags = ["Debtors"]
  #swagger.summary = "Create a new debtor"
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: { $ref: "#/components/schemas/Debtor" }
          }
      }
  }
  #swagger.responses[201]
  #swagger.security = [{ "BearerAuth": [] }]
  */
  try {
    const token = req.header("x-api-key");
    const order = await Order.findOne({
        _id: req.body.order,
        status: "pending",
        token: token,
    });
    if (!order){
        return res.unauthorized();
    }

    const newDebtor = new Debtor(req.body);
    await newDebtor.save();

    publish("order", {
        products: newDebtor.products,
        status: "waitPayment",
        callback: {
            href: `${process.env.SERVER}/api/orders/${order._id}/status`,
            method: "PATCH",
            token: order.token,
        },
    });
    
    res.created({
      message: "Debtor created successfully",
      debtorId: newDebtor._id,
    });
  } catch (error) {
    next(error);
  }
};

export const listDebtors = async (req, res, next) => {
  /*
  #swagger.tags = ["Debtors"]
  #swagger.summary = "List all debtors with pagination"
  #swagger.responses[200]
  #swagger.security = [{ "BearerAuth": [] }]
  */
  try {
    const page = parseInt(req.query._page) || 1;
    const size = parseInt(req.query._size) || 10;
    const sort = req.query._sort || "createdAt";
    const order = req.query._order === "desc" ? -1 : 1;

    const offset = (page - 1) * size;

    const debtors = await Debtor.find({})
      .skip(offset)
      .limit(size)
      .sort({ [sort]: order });

    const totalData = await Debtor.countDocuments();
    const totalPages = Math.ceil(totalData / size);

    res.ok(res.hateos_list("debtors", debtors, totalPages));
  } catch (error) {
    next(error);
  }
};
