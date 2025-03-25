import { Router } from "express";
import validator from "../middlewares/validator.js";
import productValidator from "./productValidator.js";
import { listProducts, showProduct, createProduct, editProduct, deleteProduct } from "../controllers/productController.js";

const router = Router();
router.get("/", listProducts);
router.get("/:_id", showProduct);
router.post("/", validator(productValidator), createProduct);
router.put("/:_id", validator(productValidator), editProduct);
router.delete("/:_id", deleteProduct);

export default router;