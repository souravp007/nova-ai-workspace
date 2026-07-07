import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import ApiError from "../utils/ApiError.js";


export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "nova-ai/images",
            resource_type: "image",
        });

        // Remove temporary local file
        // await fs.unlink(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        // Clean up local file if upload fails
        try {
            await fs.unlink(filePath);
        } catch { }

        throw new ApiError(500, "Failed to upload image.");
    }
};

export const deleteImage = async (publicId) => {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
};