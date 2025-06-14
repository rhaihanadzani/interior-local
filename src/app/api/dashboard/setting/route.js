import { AuthUserSession } from "@/lib/auth/authUserSession";

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

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

    // Dapatkan data dari form
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const userId = formData.get("userId");
    const imageFile = formData.get("profileImage");

    console.log("Received data:", { name, email, phone, userId });

    // Validasi data wajib
    if (!name || !email || !userId) {
      return NextResponse.json(
        { message: "Nama dan email harus diisi" },
        { status: 400 }
      );
    }

    let imagePath = null;

    // Proses upload gambar jika ada
    if (imageFile && imageFile !== "undefined") {
      console.log("Processing image file...");

      // Dapatkan ekstensi file dari nama file atau type
      let fileExt = "jpg";
      const fileName = imageFile.name;
      if (fileName) {
        fileExt = fileName.split(".").pop();
      } else if (imageFile.type) {
        fileExt = imageFile.type.split("/").pop();
      }

      // Buat direktori jika belum ada
      const uploadDir = path.join(process.cwd(), "public/uploads/profile");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate nama file unik
      const newFileName = `profile-${userId}-${Date.now()}.${fileExt}`;
      imagePath = `/uploads/profile/${newFileName}`;

      // Convert file to buffer dan simpan
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(path.join(uploadDir, newFileName), buffer);

      console.log("Image saved at:", imagePath);
    }

    // Update data user
    const updateData = {
      name,
      email,
      phone,
    };

    // Jika ada gambar baru, update relasi image
    if (imagePath) {
      console.log("Updating profile image...");

      // Cek apakah user sudah punya profile image
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profileImage: true },
      });

      if (user?.profileImage) {
        // Hapus file lama jika ada
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          user.profileImage.url
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Update existing image
        await prisma.image.update({
          where: { id: user.profileImage.id },
          data: { url: imagePath },
        });
      } else {
        // Create new image
        const newImage = await prisma.image.create({
          data: {
            url: imagePath,
            description: "Profile image",
            user: { connect: { id: userId } },
          },
        });
        updateData.profileImageId = newImage.id;
      }
    }

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
