import cloudinary from "./cloudinary";

export async function uploadProfileImage(
  buffer,
  folder = "uploads",
  mimetype = "image/jpeg"
) {
  if (!mimetype.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const format = mimetype.split("/")[1];

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", format },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
