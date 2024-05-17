import DynamicChart from "@/app/components/charts/DynamicChart";
import { cityCharts } from "../charts";

export default async function EstadisticasChicagoPage() {
  const city = "Chicago";

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      {cityCharts.map((config, index) => (
        <DynamicChart key={index} config={{ ...config, city }} />
      ))}
    </div>
  );
}
