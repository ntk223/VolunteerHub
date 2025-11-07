import { fileRepo } from "../repositories/fileRepo.js";
import cloudinary from "../config/cloudinary.js";

class FileService {
    getFileCategory = (mimetype) => {
        if (mimetype.startsWith("image/")) return "image";
        if (mimetype.startsWith("video/")) return "video";
        return "document";
    }
    async uploadFileToCloudinary(file, userId) {
        try {
            const category = this.getFileCategory(file.mimetype);

            // Bọc upload_stream trong Promise để sử dụng await
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: `volunteerhub/${category}`,
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) return reject(new Error(`Cloudinary upload error: ${error.message}`));
                        resolve(result);
                    }
                );
                stream.end(file.buffer); // Gửi dữ liệu file vào stream
            });

            // Sau khi upload thành công, lưu metadata vào DB
            const fileData = {
                url: uploadResult.secure_url,
                fileName: file.originalname,
                fileType: category,
                uploadedBy: userId,
            };

            const createdFile = await fileRepo.createFile(fileData);
            if (!createdFile) {
                throw new Error("Failed to save file metadata to database");
            }

            return createdFile;
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

}

export const fileService = new FileService();