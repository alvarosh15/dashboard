"use client";
import React, { useEffect, useState } from "react";
import { OneByOne, TwoByOne, ThreeByOne } from "@/app/components/charts/Boxes";
import PieChart from "@/app/components/charts/PieChart";
import { fetchScores } from "@/app/utils/dataFetch";

export default function EstadisticasBostonPage() {
  const [scoreData, setScoreData] = useState({
    labels: [],
    values: [],
  });

  useEffect(() => {
    fetchScores("Boston").then((data) => {
      console.log(data);
      setScoreData(data);
    });
  }, []);

  return (
    <div className="flex flex-col w-full md:flex-row md:flex-wrap *:p-1 *:h-72">
      <OneByOne>
        <PieChart
          data={[{ ...scoreData, type: "pie" }]}
          title="Puntuacion de las rutas"
        />
      </OneByOne>
      <TwoByOne>
        <PieChart
          data={[{ ...scoreData, type: "pie" }]}
          title="Puntuacion de las rutas"
        />
      </TwoByOne>
      <ThreeByOne>
        <PieChart
          data={[{ ...scoreData, type: "pie" }]}
          title="Puntuacion de las rutas"
        />
      </ThreeByOne>
    </div>
  );
}
