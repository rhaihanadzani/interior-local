import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { rating, comment } = await request.json();

    // console.log("received data", { id, rating, comment });

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: {
        rating,
        comment,
      },
    });

    return NextResponse.json(
      updatedTestimonial,
      { message: "Testimonial updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { message: "Failed to update testimonial", error: error.message },
      { status: 500 }
    );
  }
}
