const API_URL = "/api/dashboard/services";

export const getServices = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch service");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    throw error;
  }
};

export const createService = async (formData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to create service");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating services:", error);
    throw error;
  }
};

export const updateService = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to update service");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete service");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    throw error;
  }
};
