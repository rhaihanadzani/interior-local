import cloudinary from "./cloudinary";

export async function deleteImageFile(url) {
  try {
    const publicId = url.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.uploader.destroy(`interior/${publicId}`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
