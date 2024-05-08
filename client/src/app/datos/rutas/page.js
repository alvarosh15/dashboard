"use client";
import { useState, useEffect } from "react";
import { getDict, getStationCodes } from "../../utils/dataFetch";
import RoutesForm from "../../components/forms/RoutesForm";
import TableWithPages from "../../components/table/TableWithPages";

export default function RutasPage() {
  const [routes, setRoutes] = useState([]);
  const [processedRoutes, setProcessedRoutes] = useState([]);
  const [scores, setScores] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: null });
  const [stationCodes, setStationCodes] = useState([]);
  const [inputs, setInputs] = useState({
    id: "",
    city: [],
    station: [],
    score: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    lowCapacity: "",
    highCapacity: "",
    limit: 20,
  });
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/routes?`;

  useEffect(() => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/scores`;
    let dict_scores = {
      High: "Alta",
      Medium: "Media",
      Low: "Baja",
    };

    getDict(url, "Score").then((data) => {
      for (const key in data) {
        data[key] = dict_scores[data[key]];
      }
      setScores(data);
    });
    getStationCodes().then((data) => {
      setStationCodes(data);
    });
  }, []);

  useEffect(() => {
    if (routes.length > 0) {
      const newRoutes = routes.map((route) => {
        return {
          ...route,
          ScoreId: route.ScoreId ? scores[route.ScoreId] : "-",
        };
      });
      setProcessedRoutes(newRoutes);
    } else {
      setProcessedRoutes([]);
    }
  }, [routes, scores]);

  return (
    <div className="flex flex-col gap-4">
      <RoutesForm
        setRoutes={setRoutes}
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
        setInputs={setInputs}
        inputs={inputs}
        setSortConfig={setSortConfig}
        stationCodes={stationCodes}
      />

      <TableWithPages
        headers={[
          "Código de la ruta",
          "Estación",
          "Fecha",
          "Hora",
          "Capacidad",
          "Puntuación",
        ]}
        keys={[
          "RouteId",
          "StationCode",
          "Date",
          "DepartureTime",
          "ExecutorCapacity",
          "ScoreId",
        ]}
        data={processedRoutes}
        setData={setRoutes}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        inputs={inputs}
        url={url}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />
    </div>
  );
}
