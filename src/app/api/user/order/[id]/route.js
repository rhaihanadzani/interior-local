import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { AuthUserSession } from "@/lib/auth/authUserSession";

// GET single order by ID
export async function GET(request, { params }) {
  try {
    const isLogin = await AuthUserSession();

    const user = await prisma.user.findUnique({
      where: {
        email: isLogin.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        service: true,
        updates: {
          orderBy: { createdAt: "desc" },
          include: {
            images: true,
          },
        },
        images: true,
        testimonial: true,
      },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
