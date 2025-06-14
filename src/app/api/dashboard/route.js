export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { AuthUserSession } from "@/lib/auth/authUserSession";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const userLogin = await AuthUserSession();

    // Validasi session
    if (!userLogin) {
      return NextResponse.json(
        { message: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Ambil data user
    const user = await prisma.user.findUnique({
      where: {
        email: userLogin.user.email,
      },
      include: {
        profileImage: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }

    // Jika user biasa, tampilkan data pribadi
    if (user.role === "user") {
      const userOrders = await prisma.order.findMany({
        where: {
          userId: user.id,
        },
        include: {
          service: {
            select: {
              name: true,
              basePrice: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const orderStats = {
        totalOrders: userOrders.length,
        inProgress: userOrders.filter(
          (o) => o.status === "diproses" || o.status === "dikonfirmasi"
        ).length,
        completed: userOrders.filter((o) => o.status === "selesai").length,
      };

      return NextResponse.json({
        status: 200,
        message: "Dashboard data fetched successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
          profileImage: user.profileImage || null,
        },
        orders: userOrders.map((order) => ({
          id: order.id,
          service: {
            name: order.service.name,
            basePrice: order.service.basePrice,
          },
          status: order.status,
          offerPrice: order.offerPrice,
          scheduledDate: order.scheduledDate,
          createdAt: order.createdAt,
        })),
        orderStats,
      });
    }

    // Jika admin/superAdmin, tampilkan data global
    if (user.role === "admin" || user.role === "superAdmin") {
      // Ambil semua pesanan terbaru
      const recentOrders = await prisma.order.findMany({
        take: 5, // Ambil 5 pesanan terbaru
        include: {
          service: {
            select: {
              name: true,
              basePrice: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Hitung statistik semua order
      const allOrders = await prisma.order.findMany();

      const orderStats = {
        totalOrders: allOrders.length,
        inProgress: allOrders.filter(
          (o) => o.status === "diproses" || o.status === "dikonfirmasi"
        ).length,
        completed: allOrders.filter((o) => o.status === "selesai").length,
        waiting: allOrders.filter((o) => o.status === "menunggu").length,
        rejected: allOrders.filter((o) => o.status === "ditolak").length,
      };

      return NextResponse.json({
        status: 200,
        message: "Admin dashboard data fetched successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
          profileImage: user.profileImage || null,
        },
        orders: recentOrders.map((order) => ({
          id: order.id,
          service: {
            name: order.service.name,
            basePrice: order.service.basePrice,
          },
          user: {
            name: order.user.name,
            email: order.user.email,
          },
          status: order.status,
          offerPrice: order.offerPrice,
          scheduledDate: order.scheduledDate,
          createdAt: order.createdAt,
        })),
        orderStats,
      });
    }

    return NextResponse.json(
      { message: "Forbidden", status: 403 },
      { status: 403 }
    );
  } catch (error) {
    console.error("Error in dashboard API:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
        status: 500,
      },
      { status: 500 }
    );
  }
};
