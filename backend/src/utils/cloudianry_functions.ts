import cloudinary from "./cloudinary";

const uploadImageOnCloudinary = async (file: Express.Multer.File) => {
  const base64Image = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.uploader.upload(dataURI);
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
