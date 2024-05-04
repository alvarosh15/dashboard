"use client";
import TableWithPages from "../../components/table/TableWithPages";
import StopsForm from "../../components/StopsForm";
import { useState, useEffect } from "react";
import { getDict } from "../../utils/dataFetch";
import TableSkeleton from "@/app/components/table/TableSkeleton";

export default function ParadasPage() {
  const [stops, setStops] = useState([]);
  const [processedStops, setProcessedStops] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/types`;
    getDict(url, "Type").then((data) => {
      setTypes(data);
    });
  }, []);

  useEffect(() => {
    if (stops.length > 0) {
      const newStops = stops.map((stop) => {
        return {
          ...stop,
          TypeId: stop.TypeId ? types[stop.TypeId] : "-",
        };
      });
      setProcessedStops(newStops);
    } else {
      setProcessedStops([]);
    }
  }, [stops, types]);

  return (
    <div className="flex flex-col gap-4">
      <StopsForm setStops={setStops} setIsLoading={setIsLoading} />
      {isLoading ? (
        <TableSkeleton
          headers={[
            "Código de la ruta",
            "Latitud",
            "Longitud",
            "Posición",
            "Codigo de la parada",
            "Tiempo al siguiente",
            "Tipo",
            "Zona",
          ]}
          rowCount={5}
        />
      ) : (
        <TableWithPages
          headers={[
            "Código de la ruta",
            "Latitud",
            "Longitud",
            "Posición",
            "Codigo de la parada",
            "Tiempo al siguiente",
            "Tipo",
            "Zona",
          ]}
          keys={[
            "RouteId",
            "Latitude",
            "Longitude",
            "OrderPosition",
            "StopId",
            "TimeToNext",
            "TypeId",
            "ZoneId",
          ]}
          data={processedStops}
        />
      )}
    </div>
  );
}
