import express from "express";
import { applicationController } from "../controllers/applicationController.js";
const Router = express.Router()


Router.post('/', applicationController.createApplication)
Router.get('/event/:eventId', applicationController.getApplicationsByEventId)
Router.patch('/:applicationId', applicationController.changeApplicationStatus)
Router.patch('/:applicationId/cancel', applicationController.cancelApplication)
export const applicationRoute = Router;