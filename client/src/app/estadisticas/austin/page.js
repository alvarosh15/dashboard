import { OneByOne, TwoByOne, ThreeByOne } from "@/app/components/charts/Boxes";
import Pie from "@/app/components/charts/Pie";
import Bar from "@/app/components/charts/Bar";
import DynamicChart from "@/app/components/charts/DynamicChart";
import {
  numberOfRoutesByScore,
  numberOfRoutesByDay,
  numberOfRoutesByMonth,
  numberOfPackagesByStatus,
  numberOfRoutesByCapacity,
} from "@/app/utils/statistics";
import { charts, favCharts } from "../charts";

export default async function EstadisticasAustinPage() {
  const routesByScore = await numberOfRoutesByScore("Austin");
  const routesByDay = await numberOfRoutesByDay("Austin");
  const routesByMonth = await numberOfRoutesByMonth("Austin");
  const routesByCapacity = await numberOfRoutesByCapacity("Austin");
  const packagesByStatus = await numberOfPackagesByStatus("Austin");

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      {favCharts.map(({ name, city }, index) => {
        const config = charts[name];
        return <DynamicChart key={index} config={{ ...config, city }} />;
      })}

      <TwoByOne>
        <Bar
          data={routesByCapacity}
          layout={{
            xaxis: { type: "category" },
          }}
          title="Número de rutas por capacidad"
          colorPalette={"#F72585"}
        />
      </TwoByOne>
      <OneByOne>
        <Pie
          data={packagesByStatus}
          title="Estados de los paquetes"
          colorPalette={["#F72585", "#480CA8", "#7209B7", "E9E9E9"]}
          hole={0.5}
        />
      </OneByOne>
      <OneByOne>
        <Bar data={routesByMonth} title="Número de rutas por mes" />
      </OneByOne>
      <OneByOne>
        <Pie
          data={routesByScore}
          title="Puntuacion de las rutas"
          colorPalette={["#F72585", "#480CA8", "#7209B7", "E9E9E9"]}
        />
      </OneByOne>
      <ThreeByOne>
        <Bar
          data={routesByDay}
          title="Número de rutas por día"
          colorPalette={"#F72585"}
        />
      </ThreeByOne>
    </div>
  );
}
