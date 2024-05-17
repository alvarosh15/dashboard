"use client";

import { useEffect, useState } from "react";
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

export default function DynamicChart({ config }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dataFetcher = dataFetcherMapping[config.dataFetcher];
      console.log("config.city", config.city);
      const fetchedData = await dataFetcher(config.city);
      setData(fetchedData);
    };

    fetchData();
  }, [config.dataFetcher, config.city]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const size = config.size;
  const SizeComponent = sizeMapping[size];

  const type = config.type;
  const Chart = typeMapping[type];

  const title = config.title;
  let colorPalette = config.colorPalette;
  if (colorPalette.length === 1) {
    colorPalette = colorPalette[0];
  }
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
