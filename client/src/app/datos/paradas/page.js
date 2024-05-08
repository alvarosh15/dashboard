"use client";
import TableWithPages from "../../components/table/TableWithPages";
import StopsForm from "../../components/forms/StopsForm";
import { useState, useEffect } from "react";
import { getDict } from "../../utils/dataFetch";

export default function ParadasPage() {
  const [stops, setStops] = useState([]);
  const [processedStops, setProcessedStops] = useState([]);
  const [types, setTypes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: null });
  const [inputs, setInputs] = useState({
    routeId: "",
    id: "",
    lowLatitude: "",
    highLatitude: "",
    lowLongitude: "",
    highLongitude: "",
    type: [],
    zoneId: "",
    posicion: "",
    lowTimeToNext: "",
    highTimeToNext: "",
    limit: 20,
  });
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stops?`;

  useEffect(() => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/types`;
    let dict_types = {
      Station: "Almacen",
      Dropoff: "Entrega",
    };
    getDict(url, "Type").then((data) => {
      for (const key in data) {
        data[key] = dict_types[data[key]];
      }
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
      <StopsForm
        setStops={setStops}
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
        setInputs={setInputs}
        inputs={inputs}
        setSortConfig={setSortConfig}
      />
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
        setData={setStops}
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
