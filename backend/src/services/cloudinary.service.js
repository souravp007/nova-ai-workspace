import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import ApiError from "../utils/ApiError.js";


export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "nova-ai/images",
            resource_type: "image",
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        try {
            await fs.unlink(filePath);
        } catch { }

        throw new ApiError(500, "Failed to upload image.");
    }
};

export const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "nova-ai/files",
            resource_type: "raw",
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        try {
            await fs.unlink(filePath);
        } catch { }

        throw new ApiError(500, "Failed to upload file.");
    }
};

export const deleteImage = async (publicId) => {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
};