"use client";
import DynamicChart from "@/app/_components/charts/DynamicChart";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getCityCharts,
  getGeneralCharts,
  getLikedChartsIds,
} from "@/app/_utils/charts";

export default function PageCharts({ city }) {
  const [charts, setCharts] = useState([]);
  const [likedChartsIds, setLikedChartsIds] = useState([]);
  const [updatedItem, setUpdatedItem] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (city) {
          const data = await getCityCharts(city);
          setCharts(data);
        } else {
          const data = await getGeneralCharts();
          setCharts(data);
        }
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = await getLikedChartsIds();
        setLikedChartsIds(ids);
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      }
    };

    if (session) {
      fetchData();
    }
  }, [updatedItem]);

  return (
    <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
      {charts &&
        charts.map((chart, index) => (
          <DynamicChart
            key={index}
            config={{ ...chart.Config, city }}
            id={chart.Id}
            likedChartsIds={likedChartsIds}
            updatedItem={updatedItem}
            setUpdatedItem={setUpdatedItem}
          />
        ))}
    </div>
  );
}
