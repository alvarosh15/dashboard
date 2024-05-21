"use client";
import { getLikedCharts, getLikedChartsIds } from "@/app/utils/statistics";
import { useEffect, useState } from "react";
import DynamicChart from "@/app/components/charts/DynamicChart";

export default function LikedCharts() {
  const [charts, setCharts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [likedChartsIds, setLikedChartsIds] = useState([]);
  const [updatedItem, setUpdatedItem] = useState(null);

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLikedCharts();
        setCharts(data);
        const ids = await getLikedChartsIds();
        setLikedChartsIds(ids);
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      }
    };

    fetchData();
  }, [updatedItem]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        onClick={toggleExpand}
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="font-semibold pt-2 pl-2 text-sky-800 text-xl">
          Gráficas favoritas
        </h3>
        <button className="pr-2 focus:outline-none" onClick={toggleExpand}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className={`bi bi-chevron-down transition-transform duration-150 ease-in-out text-sky-800 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-full opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col w-full lg:flex-row lg:flex-wrap *:p-1 *:h-72">
          {charts.length > 0 &&
            charts.map((chart, index) => (
              <DynamicChart
                key={index}
                config={chart.config}
                id={chart.id}
                isLikedChart={true}
                likedChartsIds={likedChartsIds}
                updatedItem={updatedItem}
                setUpdatedItem={setUpdatedItem}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
