/* 
{
  size: ["1x1", "2x1", "3x1"],
  type: ["pie", "bar"],
  title: "string",
  colorPalette: ["string"] or "string",
  dataConfig: {Object},
  layoutConfig: {Object},
  dataFetcher: String of a function with city as param
}
*/

export const cityCharts = [
  {
    size: "2x1",
    type: "bar",
    title: "Número de rutas por capacidad",
    colorPalette: "#F72585",
    layoutConfig: {
      xaxis: { type: "category" },
    },
    dataFetcher: "numberOfRoutesByCapacity",
  },
  {
    size: "1x1",
    type: "pie",
    title: "Estados de los paquetes",
    dataConfig: {
      hole: 0.5,
    },
    colorPalette: ["#F72585", "#480CA8", "#7209B7", "E9E9E9"],
    dataFetcher: "numberOfPackagesByStatus",
  },
  {
    size: "1x1",
    type: "pie",
    title: "Puntuación de las rutas",
    colorPalette: ["#F72585", "#480CA8", "#7209B7", "E9E9E9"],
    dataFetcher: "numberOfRoutesByScore",
  },
  {
    size: "1x1",
    type: "bar",
    title: "Número de rutas por mes",
    colorPalette: "#F72585",
    dataFetcher: "numberOfRoutesByMonth",
  },
  {
    size: "3x1",
    type: "bar",
    title: "Número de rutas por día",
    colorPalette: "#F72585",
    dataFetcher: "numberOfRoutesByDay",
  },
];
