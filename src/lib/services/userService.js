export async function getCurrentUser() {
  try {
    const response = await fetch("/api/dashboard/setting");
    const data = await response.json();

    console.log("data", data);

    if (data.status !== 200) {
      throw new Error(data.message || "Failed to fetch user data");
    }

    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
      createdAt: data.user.createdAt,
      profileImage: data.user.profileImage ? data.user.profileImage : null,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export const getUsers = async () => {
  try {
    const response = await fetch("/api/dashboard/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw error;
  }
};

// export async function updateUserProfile(updatedData) {
//   try {
//     const response = await fetch("/api/dashboard/user", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedData),
//     });

//     const data = await response.json();

//     if (data.status !== 200) {
//       throw new Error(data.message || "Failed to update user data");
//     }

//     return data.user;
//   } catch (error) {
//     console.error("Error updating user data:", error);
//     throw error;
//   }
// }
