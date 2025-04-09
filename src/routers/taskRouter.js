import { Router } from "express";

import validator from "../middlewares/validator.js";
import taskValidator from "./taskValidator.js";
import {verify} from "../controllers/authController.js";
import { whitelist } from "../middlewares/whitelist.js";

import {
    getActiveTasks,
    createTasks,
    doneTasks,
} from "../controllers/taskController.js";

const router = Router();
router.get("/", verify, getActiveTasks);
router.post("/", verify, validator(taskValidator), createTasks);
router.patch("/:_id/done", whitelist, doneTasks);


export default router;