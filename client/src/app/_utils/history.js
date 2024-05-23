import axiosInstance from "@/app/_utils/axiosInstance";

export async function addSearchHistory(input, type) {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/history/add`,
      {
        input,
        type,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al guardar el historial:", error);
    throw error;
  }
}

export async function getSearchHistory() {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/history`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    throw error;
  }
}

export async function deleteHistoryItem(id) {
  try {
    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/history/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el elemento del historial:", error);
    throw error;
  }
}
