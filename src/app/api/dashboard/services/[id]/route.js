import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";

import cloudinary from "@/lib/cloudinary/cloudinary";
import { uploadImage } from "@/lib/cloudinary/uploadImage";

// import { uploadImage, deleteImageFile } from "@/lib/image-upload";

// GET single service by ID
export async function GET(request, { params }) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  // console.log("params", params);
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const subdesc = formData.get("subdesc");
    const basePrice = formData.get("basePrice");
    const imageFile = formData.get("image");

    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    // Data yang akan diupdate
    const updateData = {
      name,
      description,
      subdesc: subdesc || null,
      basePrice: basePrice ? parseFloat(basePrice) : null,
    };

    // Jika user upload gambar baru
    if (imageFile && imageFile instanceof Blob) {
      // Ambil data lama untuk hapus gambar di Cloudinary
      const currentService = await prisma.service.findUnique({
        where: { id },
      });

      // Hapus gambar lama di Cloudinary jika ada
      if (currentService?.imageUrl) {
        // Ambil public_id dari URL Cloudinary lama
        const parts = currentService.imageUrl.split("/");
        const publicIdWithExt = parts.slice(-2).join("/").split(".")[0]; // contoh: services/abc123

        // console.log("publicIdWithExt", publicIdWithExt);
        try {
          await cloudinary.uploader.destroy(publicIdWithExt);
        } catch (err) {
          console.warn("Gagal menghapus gambar lama:", err.message);
        }
      }

      // Upload gambar baru ke Cloudinary
      const uploadResult = await uploadImage(imageFile, "interior");
      updateData.imageUrl = uploadResult.secure_url;
    }

    // Update database
    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    // 1. Ambil data service
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // 2. Hapus gambar di Cloudinary (jika ada)
    if (service.imageUrl) {
      try {
        // Ekstrak public_id dari URL Cloudinary
        // contoh: https://res.cloudinary.com/demo/image/upload/v1234567890/services/abc123.jpg
        const parts = service.imageUrl.split("/");
        const publicIdWithExt = parts.slice(-2).join("/").split(".")[0]; // contoh: services/abc123

        await cloudinary.uploader.destroy(publicIdWithExt);
      } catch (err) {
        console.warn("Gagal menghapus gambar Cloudinary:", err.message);
      }
    }

    // 3. Hapus data service dari database
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service", details: error.message },
      { status: 500 }
    );
  }
}
