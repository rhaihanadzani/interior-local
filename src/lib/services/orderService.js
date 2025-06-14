const API_URL = "/api/user/order";

export const getOrders = async () => {
  try {
    const response = await fetch(API_URL, { credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const API_URL_Admin = "/api/dashboard";

// Get all orders (admin)
export const getAllOrdersAdmin = async () => {
  try {
    const response = await fetch(`${API_URL_Admin}/order`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching ordersss:", error);
    throw error;
  }
};

export const getAllOrdersAdminById = async (id) => {
  try {
    const response = await fetch(`${API_URL_Admin}/order/${id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orderss:", error);
    throw error;
  }
};
export const updateOrderProses = async (id, formData) => {
  console.log("formData", formData);
  try {
    const response = await fetch(`${API_URL_Admin}/order/${id}`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orderss:", error);
    throw error;
  }
};
