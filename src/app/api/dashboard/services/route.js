import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { uploadImage, deleteImageFile } from "@/lib/image-upload";

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST create new service
export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const subdesc = formData.get("subdesc");
    const basePrice = formData.get("basePrice");
    const imageFile = formData.get("image");

    if (!imageFile || !(imageFile instanceof Blob)) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const uploadResult = await uploadImage(imageFile, "services");

    const service = await prisma.service.create({
      data: {
        name,
        description,
        subdesc: subdesc || null,
        basePrice: basePrice ? parseFloat(basePrice) : null,
        imageUrl: uploadResult.filePath,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
