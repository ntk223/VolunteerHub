import express from "express";
import { applicationController } from "../controllers/applicationController.js";
const Router = express.Router()


Router.post('/', applicationController.createApplication)
Router.get('/event/:eventId', applicationController.getApplicationsByEventId)
Router.patch('/:id', applicationController.changeApplicationStatus)
Router.patch('/:id/cancel', applicationController.cancelApplication)
export const applicationRoute = Router;