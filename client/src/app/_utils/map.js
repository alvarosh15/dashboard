function translateType(type) {
  const translationMap = {
    Station: "Almacén",
    Dropoff: "Entrega",
  };

  const [prefix, name] = type.split(" - ");
  const translatedName = translationMap[name] || name;

  return `${prefix} - ${translatedName}`;
}

export async function getLocAndLatFromId(id) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/route/stops/coordinates?id=${id}`
  );
  const data = await response.json().then((json) => json.data);

  const translatedData = {
    lat: data.lat,
    lon: data.lon,
    type: data.type.map(translateType),
  };

  return translatedData;
}
