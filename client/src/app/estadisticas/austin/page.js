import { OneByOne, TwoByOne, ThreeByOne } from "@/app/components/charts/Boxes";
import PieChart from "@/app/components/charts/PieChart";
import { numberOfRoutesByScore } from "@/app/utils/dataFetch";

export default async function EstadisticasAustinPage() {
  const scores = await numberOfRoutesByScore("Austin");

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      <OneByOne>
        <PieChart
          data={scores}
          title="Puntuacion de las rutas"
          colorPalette={["#F72585", "#480CA8", "#7209B7", "E9E9E9"]}
        />
      </OneByOne>
      <TwoByOne>
        <PieChart data={scores} title="Puntuacion de las rutas" />
      </TwoByOne>
      <ThreeByOne>
        <PieChart data={scores} title="Puntuacion de las rutas" />
      </ThreeByOne>
    </div>
  );
}
