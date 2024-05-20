import axiosInstance from "./axiosInstance";

export async function search(url, inputs, sort = null, page = 1) {
  Object.keys(inputs).forEach((key) => {
    if (Array.isArray(inputs[key])) {
      inputs[key].forEach((value) => {
        url += value ? `${key}=${value}&` : "";
      });
    } else {
      url += inputs[key] ? `${key}=${inputs[key]}&` : "";
    }
  });

  if (sort && sort.key && sort.direction) {
    url += `sort=${sort.key}&direction=${sort.direction}&`;
  }
  url += `page=${page}`;

  console.log(url);
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

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

export async function getStationCodes() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/routes/station_codes`
  );
  const data = await res.json();
  return data;
}

export async function getDict(url, key) {
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);
  const dict = data.reduce((acc, elem) => {
    acc[elem[`${key}Id`]] = elem[`${key}Name`];
    return acc;
  }, {});
  return dict;
}

function translateType(type) {
  const translationMap = {
    Station: "Almacén",
    Dropoff: "Entrega",
  };

  return translationMap[type] || type;
}

export async function getLocAndLatFromId(id) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/route/stops/coordinates?id=${id}`,
    { cache: "no-store" }
  );
  const data = await response.json().then((json) => json.data);

  const translatedData = {
    lat: data.lat,
    lon: data.lon,
    type: data.type.map(translateType),
  };

  return translatedData;
}
