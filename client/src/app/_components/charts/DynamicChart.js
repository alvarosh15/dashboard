"use client";

import { useEffect, useState } from "react";
import { OneByOne, TwoByOne, ThreeByOne } from "@/app/_components/charts/Boxes";
import { Pie, Bar, Lines, Block } from "@/app/_components/charts/Charts";
import Bookmark from "@/app/_components/charts/Bookmark";
import DynamicChartSkeleton from "@/app/_components/charts/DynamicChartSkeleton";
import {
  numberOfRoutesByScore,
  numberOfRoutesByDay,
  numberOfRoutesByMonth,
  numberOfPackagesByStatus,
  numberOfRoutesByCapacity,
  numberOfRoutesByCity,
  routesByDepartureHour,
  avgPackagePerRoute,
  busiestDay,
} from "@/app/_utils/statistics";

const sizeMapping = {
  "1x1": OneByOne,
  "2x1": TwoByOne,
  "3x1": ThreeByOne,
};

const typeMapping = {
  pie: Pie,
  bar: Bar,
  lines: Lines,
  block: Block,
};

const dataFetcherMapping = {
  numberOfRoutesByScore: numberOfRoutesByScore,
  numberOfRoutesByDay: numberOfRoutesByDay,
  numberOfRoutesByMonth: numberOfRoutesByMonth,
  numberOfPackagesByStatus: numberOfPackagesByStatus,
  numberOfRoutesByCapacity: numberOfRoutesByCapacity,
  numberOfRoutesByCity: numberOfRoutesByCity,
  routesByDepartureHour: routesByDepartureHour,
  avgPackagePerRoute: avgPackagePerRoute,
  busiestDay: busiestDay,
};

export default function DynamicChart({
  config,
  id,
  likedChartsIds,
  isLikedChart = false,
  updatedItem,
  setUpdatedItem,
}) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const dataFetcher = dataFetcherMapping[config.dataFetcher];
      const fetchedData = await dataFetcher(config.city);
      setData(fetchedData);
    };

    fetchData();
  }, [config.dataFetcher, config.city]);

  if (!data) {
    return <DynamicChartSkeleton size={config.size} type={config.type} />;
  }

  const size = config.size;
  const SizeComponent = sizeMapping[size];

  const type = config.type;
  const Chart = typeMapping[type];

  const title =
    isLikedChart && config.type !== "block"
      ? config.city
        ? `${config.city} - ${config.title}`
        : `General - ${config.title}`
      : config.title;
  let colorPalette = config.colorPalette;
  if (colorPalette && colorPalette.length === 1) {
    colorPalette = colorPalette[0];
  }

  const dataConfig = config.dataConfig;
  const layoutConfig = config.layoutConfig;

  return (
    <SizeComponent>
      <Bookmark
        chartId={id}
        city={config.city}
        likedChartsIds={likedChartsIds}
        updatedItem={updatedItem}
        setUpdatedItem={setUpdatedItem}
      />
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
