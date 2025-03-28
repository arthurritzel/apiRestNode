import express from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import database from "./config/database.js";
import routes from "./routes.js";

import hateos from "./middlewares/hateos.js";
import handler from "./middlewares/handler.js";

dotenv.config();
database.config(process.env.DATABASE);

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(hateos);
app.use(handler);
app.use(routes);

export default app;