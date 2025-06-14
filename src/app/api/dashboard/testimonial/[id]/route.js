// app/api/testimonials/[id]/toggle/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const testimonialId = parseInt(params.id);

    // Dapatkan status saat ini
    const currentTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!currentTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Toggle status active
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: { active: !currentTestimonial.active },
    });

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Error toggling testimonial status:", error);
    return NextResponse.json(
      { error: "Failed to toggle testimonial status" },
      { status: 500 }
    );
  }
}
