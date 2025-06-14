export const createTestimoniUser = async (formData) => {
  try {
    const response = await fetch("/api/user/testimoni", {
      method: "POST",
      body: formData,
    });

    console.log("response", response);
    if (!response.ok) {
      throw new Error("Failed to create testimoni");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating testimoni:", error);
    throw error;
  }
};

// Fungsi untuk update testimonial
export const updateTestimonial = async ({ id, rating, comment }) => {
  try {
    const response = await fetch(`/api/user/testimoni/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update testimonial");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

export const getAllTestimonialsAdmin = async () => {
  try {
    const response = await fetch("/api/dashboard/testimonial", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch testimonials");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
};

// lib/services/testimonialService.ts
export const changeStatusTestimonial = async (id) => {
  try {
    const response = await fetch(`/api/dashboard/testimonial/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log(response);

    if (!response.ok) {
      throw new Error("Failed to toggle testimonial status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling testimonial status:", error);
    throw error;
  }
};
