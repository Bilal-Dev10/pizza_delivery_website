
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dxdnozqum",
    api_key: process.env.CLOUDINARY_API_KEY || "488461264763418",
    api_secret: process.env.CLOUDINARY_API_SECRET || "BEKUCo-aj-MPPuz5sr8cZ6P5Ngw",
});

export default cloudinary;
