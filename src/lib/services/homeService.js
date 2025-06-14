const API_BASE_URL = "/api/home";

export const getAllPortfolios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/portofolio`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch portfolios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolioss:", error);
    throw error;
  }
};
export const getAlltesttimonials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/testimoni`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch portfolios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};
export const getAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/service`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch portfolios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};
