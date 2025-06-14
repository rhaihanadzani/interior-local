import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { AuthUserSession } from "@/lib/auth/authUserSession";

// GET all orders for current user
export async function GET(request) {
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

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        service: true,
        updates: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // console.log("orders", orders);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request) {
  try {
    const userLogin = await AuthUserSession();

    const user = await prisma.user.findUnique({
      where: {
        email: userLogin.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, location, description, scheduledDate } =
      await request.json();

    // Validate required fields
    if (!serviceId || !location || !description) {
      return NextResponse.json(
        { error: "Service, location, and description are required" },
        { status: 400 }
      );
    }

    // console.log("user", user);

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: user.id } },
        service: { connect: { id: parseInt(serviceId) } },
        location,
        description,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        status: "menunggu",
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
