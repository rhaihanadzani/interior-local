import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";

export async function GET() {
  try {
    // Fetch users with their related data
    const users = await prisma.user.findMany({
      include: {
        profileImage: true,
      },
    });

    // Format the response to match your desired structure
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      profileImage: user.profileImage
        ? {
            id: user.profileImage.id,
            url: user.profileImage.url,
            description: user.profileImage.description,
          }
        : null,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
