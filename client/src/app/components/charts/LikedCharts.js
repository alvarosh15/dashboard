"use client";
import { getLikedCharts } from "@/app/utils/statistics";
import { useEffect, useState } from "react";
import DynamicChart from "@/app/components/charts/DynamicChart";

export default function LikedCharts({ id }) {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLikedCharts();
        setCharts(data);
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      {charts.length > 0 &&
        charts.map((chart, index) => (
          <DynamicChart key={index} config={chart} />
        ))}
    </div>
  );
}
