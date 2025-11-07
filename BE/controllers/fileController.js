import { fileService } from "../services/fileService.js";

class FileController {
    async uploadFile(req, res) {
        try {
            const {userId} = req.body; // Assuming user ID is available in req.body
            const file = req.file; // Assuming file is available in req.file via multer or similar middleware
            const uploadedFile = await fileService.uploadFileToCloudinary(file, userId);
            res.status(201).json({
                message: "File uploaded successfully",
                file: uploadedFile,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const fileController = new FileController();