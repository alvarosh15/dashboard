"use client";
import { useState, useEffect } from "react";
import SearchForm from "../../components/RoutesForm";
import TableWithPages from "../../components/table/TableWithPages";
import { getScores } from "../../utils/dataFetch";

export default function Search() {
  const [routes, setRoutes] = useState([]);
  const [processedRoutes, setProcessedRoutes] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    getScores().then((data) => {
      setScores(data);
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
      <SearchForm setRoutes={setRoutes} />
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
        setData={setProcessedRoutes}
      />
    </div>
  );
}
