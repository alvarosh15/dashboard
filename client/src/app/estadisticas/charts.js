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

const oneColor = "#F72585";
const fourColors = ["#F72585", "#480CA8", "#7209B7", "E9E9E9"];

export const cityCharts = [
  {
    size: "1x1",
    type: "block",
    title: "Número medio de paquetes por ruta",
    colorPalette: oneColor,
    dataFetcher: "avgPackagePerRoute",
  },
  {
    size: "1x1",
    type: "bar",
    title: "Número de salidas por hora",
    colorPalette: oneColor,
    layoutConfig: {
      xaxis: { type: "category" },
    },
    dataFetcher: "routesByDepartureHour",
  },
  {
    size: "1x1",
    type: "bar",
    title: "Número de rutas por capacidad",
    colorPalette: oneColor,
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
    colorPalette: fourColors,
    dataFetcher: "numberOfPackagesByStatus",
  },
  {
    size: "1x1",
    type: "pie",
    title: "Puntuación de las rutas",
    colorPalette: fourColors,
    dataFetcher: "numberOfRoutesByScore",
  },
  {
    size: "2x1",
    type: "bar",
    title: "Número de rutas por mes",
    colorPalette: oneColor,
    dataFetcher: "numberOfRoutesByMonth",
  },
  {
    size: "3x1",
    type: "bar",
    title: "Número de rutas por día",
    colorPalette: oneColor,
    dataFetcher: "numberOfRoutesByDay",
  },
];

export const generalCharts = [
  {
    size: "2x1",
    type: "bar",
    title: "Número de rutas por ciudad",
    colorPalette: oneColor,
    layoutConfig: {
      xaxis: { type: "category" },
    },
    dataFetcher: "numberOfRoutesByCity",
  },
  ...cityCharts,
];
