import DynamicChart from "@/app/components/charts/DynamicChart";
import { generalCharts } from "../charts";

export default async function EstadisticasGeneralPage() {
  const city = "";

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      {generalCharts.map((config, index) => (
        <DynamicChart key={index} config={{ ...config, city }} />
      ))}
    </div>
  );
}
