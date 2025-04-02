import { Router } from "express";

import validator from "../middlewares/validator.js";
import taskValidator from "./taskValidator.js";

import {
    getActiveTasks,
    createTasks,
    doneTasks,
} from "../controllers/taskController.js";

const router = Router();
router.get("/", getActiveTasks);
router.post("/", validator(taskValidator), createTasks);
router.patch("/:_id/done", doneTasks);


export default router;