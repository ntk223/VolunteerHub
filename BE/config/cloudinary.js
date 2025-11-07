import { env } from "./environment.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_API_KEY,
    api_secret: env.CLOUD_API_SECRET,
});

export default cloudinary;
