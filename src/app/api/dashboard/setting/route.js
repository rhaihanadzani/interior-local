import { AuthUserSession } from "@/lib/auth/authUserSession";

import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { deleteImageFile } from "@/lib/cloudinary/deleteImage";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { uploadProfileImage } from "@/lib/cloudinary/uploadProfileImage";
import { deleteProfileImageFile } from "@/lib/cloudinary/deleteProfileImage";

const prisma = new PrismaClient();
export const GET = async () => {
  const userLogin = await AuthUserSession();
  const user = await prisma.user.findUnique({
    where: {
      email: userLogin.user.email,
    },
    include: {
      profileImage: true,
    },
  });

  return NextResponse.json({ message: "success", status: 200, user });
};

export async function PATCH(request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const userId = formData.get("userId");
    const imageFile = formData.get("profileImage");

    // console.log("Received data:", { name, email, phone, userId });

    // Validasi input wajib
    if (!name || !email || !userId) {
      return NextResponse.json(
        { message: "Nama dan email harus diisi" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // 🔹 Upload gambar ke Cloudinary jika ada
    if (imageFile && imageFile !== "undefined") {
      // console.log("Uploading new profile image to Cloudinary...");

      if (!(imageFile instanceof Blob)) {
        return NextResponse.json(
          { message: "File gambar tidak valid" },
          { status: 400 }
        );
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimetype = imageFile.type || "image/jpeg";

      const uploadResult = await uploadProfileImage(
        buffer,
        "interior",
        mimetype
      );
      imageUrl = uploadResult.secure_url;
      // console.log("Image uploaded to:", imageUrl);
    }

    // 🔹 Ambil data user lama
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profileImage: true },
    });

    const updateData = { name, email, phone };

    // 🔹 Jika ada gambar baru
    if (imageUrl) {
      if (user?.profileImage) {
        // console.log("Deleting old Cloudinary image...");
        await deleteProfileImageFile(user.profileImage.url);

        await prisma.image.update({
          where: { id: user.profileImage.id },
          data: { url: imageUrl },
        });
      } else {
        const newImage = await prisma.image.create({
          data: {
            url: imageUrl,
            description: "Profile image",
            user: { connect: { id: userId } },
          },
        });
        updateData.profileImageId = newImage.id;
      }
    }

    // 🔹 Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { profileImage: true },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
