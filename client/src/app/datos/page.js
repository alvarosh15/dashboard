"use client";
import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import FullTable from "../components/TableWithPages";
import { getScores } from "../utils/utils";

export default function Search() {
  const [routes, setRoutes] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    getScores().then((data) => {
      setScores(data);
    });
  }, []);

  useEffect(() => {
    routes.map((route) => {
      if (!isNaN(route.ScoreId)) {
        route.ScoreId = scores[route.ScoreId] ? scores[route.ScoreId] : "-";
      }
    });
  }, [routes, scores]);

  return (
    <div className="flex flex-col gap-4">
      <SearchForm setRoutes={setRoutes} />
      <FullTable
        headers={["ID", "Estación", "Fecha", "Hora", "Capacidad", "Puntuación"]}
        keys={[
          "RouteId",
          "StationCode",
          "Date",
          "DepartureTime",
          "ExecutorCapacity",
          "ScoreId",
        ]}
        data={routes}
      />
    </div>
  );
}
