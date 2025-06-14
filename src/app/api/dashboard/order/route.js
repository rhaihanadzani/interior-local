import { NextResponse } from "next/server";
import prisma from "@/lib/auth/prisma";
import { uploadImage } from "@/lib/image-upload";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          include: {
            profileImage: true,
          },
        },
        service: true,
        updates: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("orders", orders);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const name = formData.get("name");
//     const description = formData.get("description");
//     const subdesc = formData.get("subdesc");
//     const basePrice = formData.get("basePrice");
//     const imageFile = formData.get("image");

//     if (!imageFile || !(imageFile instanceof Blob)) {
//       return NextResponse.json({ error: "Image is required" }, { status: 400 });
//     }

//     const uploadResult = await uploadImage(imageFile, "orderUpdate");

//     const service = await prisma.service.create({
//       data: {
//         name,
//         description,
//         subdesc: subdesc || null,
//         basePrice: basePrice ? parseFloat(basePrice) : null,
//         imageUrl: uploadResult.filePath,
//       },
//     });

//     return NextResponse.json(service);
//   } catch (error) {
//     console.error("Error creating service:", error);
//     return NextResponse.json(
//       { error: "Failed to create service" },
//       { status: 500 }
//     );
//   }
// }
