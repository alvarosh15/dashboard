import axiosInstance from "./axiosInstance";

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
