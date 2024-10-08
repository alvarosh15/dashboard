const dict_scores = {
  High: "Alta",
  Medium: "Media",
  Low: "Baja",
  "Sin datos": "Sin datos",
};
const dict_status = {
  DELIVERY_ATTEMPTED: "Intento de entrega",
  DELIVERED: "Entregado",
  REJECTED: "Rechazado",
  "Sin datos": "Sin datos",
};

export async function numberOfRoutesByScore(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/score_counts?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);

  let labels = Object.keys(data);
  const values = labels.map((label) => data[label]);
  for (const key in labels) {
    labels[key] = dict_scores[labels[key]];
  }
  let aux = { labels, values };
  return aux;
}

export async function numberOfRoutesByDay(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/routes_by_day?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);
  const x = Object.keys(data);
  const y = x.map((date) => data[date]);
  let aux = { x, y };
  return aux;
}

export async function numberOfRoutesByMonth(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/routes_by_month?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);
  const x = Object.keys(data);
  const y = x.map((date) => data[date]);
  let aux = { x, y };
  return aux;
}

export async function numberOfPackagesByStatus(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/packages_by_status?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);

  let labels = Object.keys(data);
  const values = labels.map((label) => data[label]);
  for (const key in labels) {
    labels[key] = dict_status[labels[key]];
  }
  let aux = { labels, values };
  return aux;
}

export async function numberOfRoutesByCapacity(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/routes_by_capacity?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);
  const x = Object.keys(data);
  const y = x.map((date) => data[date]);
  let aux = { x, y };
  return aux;
}

export async function numberOfRoutesByCity() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/routes_by_city`;
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);

  const x = Object.keys(data);
  const y = x.map((city) => data[city]);

  let result = { x, y };
  return result;
}

export async function routesByDepartureHour(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/routes_by_departure_hour?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);

  const x = Object.keys(data).map(Number);
  const y = x.map((hour) => data[hour]);

  let result = { x, y };
  return result;
}

export async function avgPackagePerRoute(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/avg_packages?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);

  return data;
}

export async function busiestDay(city) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/busiest_day?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url);
  const data = await res.json().then((json) => json.data);

  return data;
}
