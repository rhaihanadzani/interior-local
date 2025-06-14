import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import { prisma } from "@/lib/auth/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil data testimonial dari database dengan relasi yang diperlukan
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        order: {
          include: {
            service: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Urutkan dari yang terbaru
      },
    });

    // Format data sesuai dengan struktur dummy
    const formattedTestimonials = testimonials.map((testimonial) => ({
      id: testimonial.id,
      user: {
        name: testimonial.user.name,
        profileImage: testimonial.user.profileImage
          ? {
              url: testimonial.user.profileImage,
              description: `Profile picture of ${testimonial.user.name}`,
            }
          : null,
      },
      order: {
        service: {
          name: testimonial.order.service.name,
        },
      },
      rating: testimonial.rating,
      comment: testimonial.comment,
      active: testimonial.active,
      createdAt: testimonial.createdAt,
    }));

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
