import cloudinary from "./cloudinary";

export async function uploadImages(
  buffer,
  folder = "uploads",
  mimetype = "image/jpeg"
) {
  // Validasi tipe file
  if (!mimetype.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  // Tentukan format berdasarkan mimetype
  const format = mimetype.split("/")[1];

  // Upload ke Cloudinary via stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format, // otomatis jpg/png sesuai mimetype
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}
