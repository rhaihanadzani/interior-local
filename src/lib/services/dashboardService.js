export async function getDashboardData() {
  try {
    const response = await fetch("/api/dashboard");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(data.message || "Failed to fetch dashboard data");
    }

    // Return data sesuai role user
    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
        createdAt: data.user.createdAt,
        profileImage: data.user.profileImage?.url
          ? data.user.profileImage
          : null,
      },
      orders: data.orders || [], // Pesanan (user: pesanan sendiri, admin: pesanan terbaru semua user)
      orderStats: data.orderStats, // Statistik (user: statistik sendiri, admin: statistik semua order)
      isAdmin: data.user.role === "admin" || data.user.role === "superAdmin",
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
