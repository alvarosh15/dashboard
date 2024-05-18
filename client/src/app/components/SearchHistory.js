import SearchHistoryItem from "./SearchHistoryItem";
import { useEffect, useState } from "react";
import { getSearchHistory } from "@/app/utils/dataFetch";

export default function SearchHistory() {
  const [routesHistory, setRoutesHistory] = useState([]);
  const [stopsHistory, setStopsHistory] = useState([]);
  const [packagesHistory, setPackagesHistory] = useState([]);

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

  return (
    <div>
      <h3 className="font-semibold pt-2 pl-2 text-sky-800 text-xl">
        Historial de búsqueda
      </h3>
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
  );
}
