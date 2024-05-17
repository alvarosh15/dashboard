import { OneByOne, TwoByOne, ThreeByOne } from "@/app/components/charts/Boxes";
import { Pie, Bar } from "@/app/components/charts/Charts";
import Bookmark from "./Bookmark";
import {
  numberOfRoutesByScore,
  numberOfRoutesByDay,
  numberOfRoutesByMonth,
  numberOfPackagesByStatus,
  numberOfRoutesByCapacity,
} from "@/app/utils/statistics";

const sizeMapping = {
  "1x1": OneByOne,
  "2x1": TwoByOne,
  "3x1": ThreeByOne,
};

const typeMapping = {
  pie: Pie,
  bar: Bar,
};

const dataFetcherMapping = {
  numberOfRoutesByScore: numberOfRoutesByScore,
  numberOfRoutesByDay: numberOfRoutesByDay,
  numberOfRoutesByMonth: numberOfRoutesByMonth,
  numberOfPackagesByStatus: numberOfPackagesByStatus,
  numberOfRoutesByCapacity: numberOfRoutesByCapacity,
};

export default async function DynamicChart({ config }) {
  const dataFetcher = dataFetcherMapping[config.dataFetcher];
  const data = await dataFetcher(config.city);

  const size = config.size;
  const SizeComponent = sizeMapping[size];

  const type = config.type;
  const Chart = typeMapping[type];

  const title = config.title;
  const colorPalette = config.colorPalette;
  const dataConfig = config.dataConfig;
  const layoutConfig = config.layoutConfig;

  return (
    <SizeComponent>
      <Bookmark config={{ config }} />
      <Chart
        data={data}
        title={title}
        colorPalette={colorPalette}
        dataConfig={dataConfig}
        layoutConfig={layoutConfig}
      />
    </SizeComponent>
  );
}
