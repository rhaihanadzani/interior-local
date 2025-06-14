import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { uploadImage, deleteImageFile } from "@/lib/image-upload";

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

// PUT update service
export async function PUT(request, { params }) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const subdesc = formData.get("subdesc");
    const basePrice = formData.get("basePrice");
    const imageFile = formData.get("image");

    const updateData = {
      name,
      description,
      subdesc: subdesc || null,
      basePrice: basePrice ? parseFloat(basePrice) : null,
    };

    // Handle image update if new image is provided
    if (imageFile && imageFile instanceof Blob) {
      // Get current service to delete old image
      const currentService = await prisma.service.findUnique({
        where: { id: parseInt(params.id) },
      });

      if (currentService?.imageUrl) {
        await deleteImageFile(currentService.imageUrl);
      }

      const uploadResult = await uploadImage(imageFile, "services");
      updateData.imageUrl = uploadResult.filePath;
    }

    const updatedService = await prisma.service.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(request, { params }) {
  try {
    // Get service first to delete image file
    const service = await prisma.service.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete image file
    if (service.imageUrl) {
      await deleteImageFile(service.imageUrl);
    }

    // Delete service from database
    await prisma.service.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
