import { AuthUserSession } from "@/lib/auth/authUserSession";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const orderId = formData.get("orderId");
    const rating = formData.get("rating");
    const comment = formData.get("comment");

    const userLogin = await AuthUserSession();

    if (!userLogin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        order: {
          connect: {
            id: orderId,
          },
        },
        rating: parseInt(rating),
        comment,
        user: {
          connect: {
            id: userLogin.user.id,
          },
        },
        active: false,
      },
    });

    // console.log("testimonial", testimonial);

    return NextResponse.json({ message: "success", status: 200, testimonial });
  } catch (error) {
    console.error("Error creating testimoni:", error);
    return NextResponse.json(
      { error: "Failed to create testimoni" },
      { status: 500 }
    );
  }
}
