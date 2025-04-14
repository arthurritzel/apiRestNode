import { Router } from "express";
import validator from "../middlewares/validator.js";
import orderValidator from "./orderValidator.js";
import { createOrder, listOrders, changeOrderStatus } from "../controllers/orderController.js";
import { verify } from "../controllers/authController.js";
import { whitelist } from "../middlewares/whitelist.js";

const router = Router();

router.get("/", verify, listOrders);
router.post("/", verify, validator(orderValidator), createOrder);
router.patch("/:id/status", whitelist, changeOrderStatus);

export default router;