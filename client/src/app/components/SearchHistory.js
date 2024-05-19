import SearchHistoryItem from "./SearchHistoryItem";
import { useEffect, useState } from "react";
import { getSearchHistory } from "@/app/utils/dataFetch";

export default function SearchHistory() {
  const [routesHistory, setRoutesHistory] = useState([]);
  const [stopsHistory, setStopsHistory] = useState([]);
  const [packagesHistory, setPackagesHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getSearchHistory();
        setRoutesHistory(history.Route);
        setStopsHistory(history.Stop);
        setPackagesHistory(history.Package);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        onClick={toggleExpand}
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="font-semibold pt-2 pl-2 pb-1 text-sky-800 text-xl">
          Historial de búsqueda
        </h3>
        <button className="pr-2 focus:outline-none">
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
        <div className="flex flex-col bg-white rounded-md shadow-sm gap-2 p-3">
          <h4 className="font-medium text-sky-800 text-lg">Rutas</h4>
          {routesHistory.map((value, index) => (
            <SearchHistoryItem key={index} item={value} type={"Rutas"} />
          ))}
          <h4 className="font-medium text-sky-800 text-lg">Paradas</h4>
          {stopsHistory.map((value, index) => (
            <SearchHistoryItem key={index} item={value} type={"Paradas"} />
          ))}
          <h4 className="font-medium text-sky-800 text-lg">Paquetes</h4>
          {packagesHistory.map((value, index) => (
            <SearchHistoryItem key={index} item={value} type={"Paquetes"} />
          ))}
        </div>
      </div>
    </div>
  );
}
