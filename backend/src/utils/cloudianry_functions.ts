import cloudinary from "./cloudinary";
import fs from 'fs';

const uploadImageOnCloudinary = async (file: Express.Multer.File) => {
  const uploadResponse = await cloudinary.uploader.upload(file.path);
  fs.unlinkSync(file.path);
  return uploadResponse.secure_url;
};

const getPublicIdFromURL = (url: string) => {
  const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const deleteImageOnCloudinary = async (imageUrl: string) => {
  try {
    if (!imageUrl) return null;

    const publicId = getPublicIdFromURL(imageUrl);
    if (!publicId) {
      console.log("Public ID could not be extracted from URL.");
      return null;
    }

    const response = await cloudinary.uploader.destroy(publicId);

    console.log("File has been deleted from Cloudinary", response);
    return response;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return null;
  }
};

export { uploadImageOnCloudinary, deleteImageOnCloudinary };
