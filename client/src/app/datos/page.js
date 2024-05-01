"use client";
import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import RouteTable from "../components/RouteTable";
import { getScores } from "../utils/utils";

export default function Search() {
  const [routes, setRoutes] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    getScores().then((data) => {
      setScores(data);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <SearchForm setRoutes={setRoutes} />
      <RouteTable routes={routes} scores={scores} />
    </div>
  );
}
