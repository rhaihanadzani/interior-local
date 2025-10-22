import cloudinary from "./cloudinary";

export async function deleteProfileImageFile(url) {
  try {
    // Ambil public_id dari URL Cloudinary
    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0];
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");

    const publicId = `${folder}/${fileName}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
