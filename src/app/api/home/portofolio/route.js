import prisma from "@/lib/auth/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get all active portfolios
    const portfolios = await prisma.portfolio.findMany({
      where: {
        active: true,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(portfolios, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}
