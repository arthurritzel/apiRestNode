import { Router } from "express";

import NotFound from "./routers/helpers/404.js";
import InternalServerError from "./routers/helpers/500.js";

import hateos from "./middlewares/hateos.js";
import handler from "./middlewares/handler.js";

import AuthRouter from "./routers/authRouter.js"
import UserRouter  from "./routers/userRouter.js";
import ProductRouter from "./routers/productRouter.js";
import TaskRouter from "./routers/taskRouter.js";

import { verify } from "./controllers/authController.js"

const routes = Router()
routes.use(hateos);
routes.use(handler);

routes.use("/login", AuthRouter)
routes.use("/api/tasks", TaskRouter)
routes.use("/api", verify, UserRouter, ProductRouter)

routes.use(InternalServerError)
routes.use(NotFound);

export default routes;