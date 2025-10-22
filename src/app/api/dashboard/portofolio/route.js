import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { uploadImage, deleteImageFile } from "@/lib/image-upload";
import { uploadImages } from "@/lib/cloudinary/uploadImages";

// GET all portfolios with their images
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        images: true,
      },
    });
    return NextResponse.json(portfolios);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

// POST create new portfolio with images
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const active = formData.get("active") === "true";
    const images = formData.getAll("images");
    const category = formData.get("category") || "";

    // console.log("Received data:", { title, description, active, images });

    // Create portfolio first
    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        active,
        category: category,
      },
    });

    // Handle image uploads
    const uploadedImages = [];
    for (const imageFile of images) {
      if (imageFile instanceof Blob) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await uploadImages(buffer, "interior");
        const createdImage = await prisma.image.create({
          data: {
            url: uploadResult.secure_url,
            description: "Portfolio image",
            portfolio: {
              connect: {
                id: portfolio.id,
              },
            },
          },
        });
        uploadedImages.push(createdImage);
      }
    }

    return NextResponse.json({
      ...portfolio,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}
