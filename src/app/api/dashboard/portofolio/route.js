import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { uploadImage, deleteImageFile } from "@/lib/image-upload";

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
        const uploadResult = await uploadImage(imageFile, "portfolios");
        const createdImage = await prisma.image.create({
          data: {
            url: uploadResult.filePath,
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
