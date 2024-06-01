import axiosInstance from "@/app/_utils/axiosInstance";

export async function getCityCharts() {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/charts/city`
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error("Error retrieving charts:", error);
  }
}

export async function getGeneralCharts() {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/charts/general`
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error("Error retrieving charts:", error);
  }
}

export async function getLikedCharts() {
  try {
    const response = await axiosInstance.get("/liked_charts", {
      cache: "no-store",
    });
    const json = response.data;
    const liked = json.data;
    return liked;
  } catch (error) {
    throw error;
  }
}

export async function removeLikeChart(chartId, city) {
  try {
    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/liked_charts/${chartId}`,
      { data: { city: city } }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
}

export async function getLikedChartsIds() {
  try {
    const response = await axiosInstance.get("/liked_charts/ids", {
      cache: "no-store",
    });
    const json = response.data;
    const liked = json.data;
    return liked;
  } catch (error) {
    throw error;
  }
}

export async function addLikeChart(chartId, city) {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/liked_charts`,
      {
        chartId,
        city,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
}
