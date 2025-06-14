// import prisma from "@/lib/auth/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/image-upload";

const prisma = new PrismaClient();
export async function GET(request, { params }) {
  console.log("params", params);
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

    // Ambil data dari formData
    const status = formData.get("status");
    const note = formData.get("note");
    const images = formData.getAll("images");
    // Validasi input
    if (!status || !note) {
      return NextResponse.json(
        { error: "Status dan catatan update diperlukan" },
        { status: 400 }
      );
    }

    console.log("received data", status, note, images);

    // Mulai transaction database
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Update status order
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
      });

      // 2. Buat order update
      const orderUpdate = await prisma.orderUpdate.create({
        data: {
          orderId: id,
          note,
        },
        include: {
          images: true,
        },
      });

      // Handle image uploads
      const uploadedImages = [];
      if (images.length > 0) {
        for (const imageFile of images) {
          if (imageFile instanceof Blob) {
            const uploadResult = await uploadImage(imageFile, "order-updates");
            const createdImage = await prisma.image.create({
              data: {
                url: uploadResult.filePath,
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
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui order", details: error.message },
      { status: 500 }
    );
  }
}
