import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadImage(imageFile, folder = "") {
  try {
    const uploadDir = path.join(UPLOAD_DIR, folder);

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = await imageFile.arrayBuffer();
    const uniqueName = `${uuidv4()}-${imageFile.name}`;
    const filePath = path.join(uploadDir, uniqueName);
    const publicPath = `/uploads/${folder}/${uniqueName}`;

    await fs.writeFile(filePath, Buffer.from(buffer));

    return {
      success: true,
      filePath: publicPath,
      fileName: uniqueName,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImageFile(imagePath) {
  try {
    if (!imagePath) return;

    // Remove leading slash to make path relative to public folder
    const relativePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    const fullPath = path.join(process.cwd(), "public", relativePath);

    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error("Error deleting image file:", error);
    return false;
  }
}
