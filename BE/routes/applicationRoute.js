import express from "express";
import { applicationController } from "../controllers/applicationController.js";
const Router = express.Router()


Router.post('/', applicationController.createApplication)

export const applicationRoute = Router;