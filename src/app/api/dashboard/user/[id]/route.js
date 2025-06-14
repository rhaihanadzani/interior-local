import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import prisma from "@/lib/auth/prisma";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id: userId } = params;
    const { role } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: userId } = params;

    // Mulai transaksi untuk memastikan semua operasi atomic
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Hapus semua testimonials user
      await prisma.testimonial.deleteMany({
        where: { userId },
      });

      // 2. Hapus semua order beserta relasinya
      const userOrders = await prisma.order.findMany({
        where: { userId },
        select: { id: true },
      });

      for (const order of userOrders) {
        // Hapus order updates dan images terkait
        const orderUpdate = await prisma.orderUpdate.deleteMany({
          where: { orderId: order.id },
        });

        console.log("orderUpdate", orderUpdate);

        // Hapus testimonial yang terkait dengan order ini
        await prisma.testimonial.deleteMany({
          where: { orderId: order.id },
        });
      }

      // Hapus semua orders user
      await prisma.order.deleteMany({
        where: { userId },
      });

      // 3. Hapus profile image user jika ada
      // await prisma.image.delete({
      //   where: { user: { id: userId } },
      // });

      // 4. Terakhir, hapus user itu sendiri
      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      return deletedUser;
    });

    return NextResponse.json({
      message: "User dan semua data terkait berhasil dihapus",
      deletedUser: result,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Gagal menghapus user: " + error.message },
      { status: 500 }
    );
  }
}
