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

export async function getStationCodes() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/routes/station_codes`
  );
  const data = await res.json();
  return data;
}

export async function getDict(url, key) {
  const res = await fetch(url);
  const data = await res.json();
  const dict = data.reduce((acc, elem) => {
    acc[elem[`${key}Id`]] = elem[`${key}Name`];
    return acc;
  }, {});
  return dict;
}

export async function getLocAndLatFromId(id) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stops/coordinates?id=${id}`,
    { cache: "no-store" }
  );
  const coordinates = await response.json();
  console.log(coordinates);
  return coordinates;
}
