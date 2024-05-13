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
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/score_counts?`;
  if (city) {
    url += `city=${city}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  let labels = Object.keys(data);
  const values = labels.map((label) => data[label]);
  for (const key in labels) {
    labels[key] = dict_scores[labels[key]];
  }
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

  let labels = Object.keys(data);
  const values = labels.map((label) => data[label]);
  for (const key in labels) {
    labels[key] = dict_status[labels[key]];
  }
  let aux = { labels, values };
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
