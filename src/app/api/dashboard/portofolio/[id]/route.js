import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { uploadImage, deleteImageFile } from "@/lib/image-upload";

// GET single portfolio by ID
export async function GET(request, { params }) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        images: true,
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

// PUT update portfolio (full update)
export async function PUT(request, { params }) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const active = formData.get("active") === "true";
    const newImages = formData.getAll("images");
    const deletedImageIds = JSON.parse(formData.get("deletedImageIds") || "[]");

    // First, delete all existing images if doing full update
    const existingImages = await prisma.image.findMany({
      where: {
        portfolioId: parseInt(params.id),
      },
    });

    // Delete from database
    await prisma.image.deleteMany({
      where: {
        portfolioId: parseInt(params.id),
      },
    });

    // Delete actual files
    for (const image of existingImages) {
      await deleteImageFile(image.url);
    }

    // Update portfolio data
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        active,
      },
    });

    // Handle new image uploads
    const uploadedImages = [];
    for (const imageFile of newImages) {
      if (imageFile instanceof Blob) {
        const uploadResult = await uploadImage(imageFile, "portfolios");
        const createdImage = await prisma.image.create({
          data: {
            url: uploadResult.filePath,
            description: "",
            portfolio: {
              connect: {
                id: updatedPortfolio.id,
              },
            },
          },
        });
        uploadedImages.push(createdImage);
      }
    }

    return NextResponse.json({
      ...updatedPortfolio,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

// PATCH update portfolio (partial update)
export async function PATCH(request, { params }) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const active = formData.get("active");
    const category = formData.get("category") || "";

    const newImages = formData.getAll("newImages");
    const existingImageIds = JSON.parse(formData.get("existingImageIds") || []);
    const deletedImageIds = JSON.parse(formData.get("deletedImageIds") || []);

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (active !== null) updateData.active = active === "true";
    if (category) updateData.category = category;

    // Delete only specified images
    if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.image.findMany({
        where: { id: { in: deletedImageIds } },
      });

      await prisma.image.deleteMany({
        where: { id: { in: deletedImageIds } },
      });

      // Delete files
      for (const image of imagesToDelete) {
        await deleteImageFile(image.url);
      }
    }

    // Update portfolio data
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    // Upload new images
    const uploadedImages = [];
    for (const imageFile of newImages) {
      if (imageFile instanceof Blob) {
        const uploadResult = await uploadImage(imageFile, "portfolios");
        const createdImage = await prisma.image.create({
          data: {
            url: uploadResult.filePath,
            description: "Portfolio image",
            portfolio: { connect: { id: updatedPortfolio.id } },
          },
        });
        uploadedImages.push(createdImage);
      }
    }

    // Get all images (existing + new)
    const images = await prisma.image.findMany({
      where: { portfolioId: updatedPortfolio.id },
    });

    return NextResponse.json({
      ...updatedPortfolio,
      images,
    });
  } catch (error) {
    console.error("Error patching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to partially update portfolio" },
      { status: 500 }
    );
  }
}

// DELETE portfolio
export async function DELETE(request, { params }) {
  try {
    // First get the portfolio with images to delete files later
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        images: true,
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.portfolio.delete({
      where: { id: parseInt(params.id) },
    });

    // Delete all associated image files
    for (const image of portfolio.images) {
      await deleteImageFile(image.url);
    }

    return NextResponse.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}
