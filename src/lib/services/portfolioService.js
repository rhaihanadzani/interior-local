const API_URL = "/api/dashboard/portofolio";

export const getPortfolios = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch portfolios");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};

export const getPortfolioById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch portfolio");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching portfolio ${id}:`, error);
    throw error;
  }
};

export const createPortfolio = async (formData) => {
  // console.log("formData", formData);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to create portfolio");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
};

export const updatePortfolio = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to update portfolio");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating portfolio ${id}:`, error);
    throw error;
  }
};

export const deletePortfolio = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete portfolio");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting portfolios ${id}:`, error);
    throw error;
  }
};
