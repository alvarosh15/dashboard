import { numberOfRoutesByScore } from "@/app/utils/statistics";

export const charts = {
  "routes-score": {
    size: "1x1",
    type: "pie",
    title: "Puntuación de las rutas",
    dataFetcher: numberOfRoutesByScore,
  },
};

export const favCharts = [{ name: "routes-score", city: "Austin" }];
