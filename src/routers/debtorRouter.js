import { Router } from "express";
import validator from "../middlewares/validator.js";
import debtorValidator from "./debtorValidator.js";
import { createDebtor, listDebtors } from "../controllers/debtorController.js";
import { whitelist } from "../middlewares/whitelist.js";
import { verify } from "../controllers/authController.js";

const router = Router();

router.get("/", verify, listDebtors);
router.post("/", whitelist, validator(debtorValidator), createDebtor);

export default router;
