import express from "express";
import { managerController } from "../controllers/managerController.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.js";

const Router = express.Router();

Router.use(verifyTokenMiddleware);

Router.get("/by-user/:userId", managerController.getByUserId);

export const managerRoute = Router;
