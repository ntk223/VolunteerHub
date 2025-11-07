import express from 'express';
import multer from "multer";
import { fileController } from '../controllers/fileController.js';

// Cấu hình multer (lưu file tạm trong RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const Router = express.Router();

Router.post('/upload', upload.single('file'), fileController.uploadFile);

export const fileRoute = Router;