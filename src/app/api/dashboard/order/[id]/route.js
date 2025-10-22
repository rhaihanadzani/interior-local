// import prisma from "@/lib/auth/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { uploadImages } from "@/lib/cloudinary/uploadImages";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const prisma = new PrismaClient();
export async function GET(request, { params }) {
  // console.log("params", params);
  try {
    const orderAdmin = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        service: true,
        updates: {
          orderBy: { createdAt: "desc" },
          include: {
            images: true,
          },
        },
        user: true,
        testimonial: true,
      },
    });

    if (!orderAdmin) {
      return NextResponse.json(
        { error: "order admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(orderAdmin);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order admin" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const formData = await request.formData();

    const status = formData.get("status");
    const note = formData.get("note");
    const images = formData.getAll("images");

    // console.log(images, "images");

    // Validasi input
    if (!status || !note) {
      return NextResponse.json(
        { error: "Status dan catatan update diperlukan" },
        { status: 400 }
      );
    }

    // Jalankan transaksi prisma
    const result = await prisma.$transaction(
      async (prisma) => {
        // 1. Update status order
        const updatedOrder = await prisma.order.update({
          where: { id },
          data: { status },
        });

        // 2. Tambahkan entri order update baru
        const orderUpdate = await prisma.orderUpdate.create({
          data: {
            orderId: id,
            note,
          },
          include: {
            images: true,
          },
        });

        // 3. Upload images ke Cloudinary (jika ada)
        const uploadedImages = [];
        if (images.length > 0) {
          for (const imageFile of images) {
            if (imageFile instanceof Blob) {
              const bytes = await imageFile.arrayBuffer();
              const buffer = Buffer.from(bytes);

              // Upload ke Cloudinary (reusable function)
              const uploadResult = await uploadImages(buffer, "interior");

              // Simpan URL ke database
              const createdImage = await prisma.image.create({
                data: {
                  url: uploadResult.secure_url,
                  description: "Update Order",
                  update: {
                    connect: {
                      id: orderUpdate.id,
                    },
                  },
                },
              });

              uploadedImages.push(createdImage);
            }
          }
        }

        return {
          order: updatedOrder,
          update: {
            ...orderUpdate,
            images: uploadedImages,
          },
        };
      },
      { timeout: 100000 }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui order", details: error.message },
      { status: 500 }
    );
  }
}
