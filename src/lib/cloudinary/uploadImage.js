import cloudinary from "./cloudinary";

/**
 * Upload file Blob ke Cloudinary
 * @param {Blob} file - Blob dari formData
 * @param {string} folder - nama folder di Cloudinary
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function uploadImage(file, folder = "interior") {
  if (!file || !(file instanceof Blob)) {
    throw new Error("Invalid file type");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

  return result;
}
