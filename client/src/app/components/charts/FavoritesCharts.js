"use client";
import { getFavoritesCharts } from "@/app/utils/statistics";
import { useEffect, useState } from "react";
import DynamicChart from "@/app/components/charts/DynamicChart";

export default function FavoritesCharts({ id }) {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFavoritesCharts();
        setCharts(data);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    console.log("Charts state updated:", charts);
  }, [charts]);

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      {charts.length > 0 &&
        charts.map((chart, index) => (
          <DynamicChart key={index} config={chart} />
        ))}
    </div>
  );
}
