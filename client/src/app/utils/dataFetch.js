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

export async function numberOfRoutesByScore(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/score_counts?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  const labels = Object.keys(data);
  const values = labels.map((label) => data[label]);
  let aux = { labels, values };
  return aux;
}

export async function numberOfRoutesByDay(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/routes_by_day?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  const x = Object.keys(data);
  const y = x.map((date) => data[date]);
  let aux = { x, y };
  return aux;
}

export async function numberOfRoutesByMonth(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/routes_by_month?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  const x = Object.keys(data);
  const y = x.map((date) => data[date]);
  let aux = { x, y };
  return aux;
}

export async function numberOfPackagesByStatus(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/packages_by_status?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  const labels = Object.keys(data);
  const values = labels.map((label) => data[label]);
  let aux = { labels, values };
  console.log(aux);
  return aux;
}

export async function numberOfRoutesByCapacity(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/routes_by_capacity?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  const x = Object.keys(data);
  const y = x.map((date) => data[date]);
  let aux = { x, y };
  return aux;
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
