"use client";
import TableWithPages from "@/app/_components/table/TableWithPages";
import StopsForm from "@/app/_components/forms/StopsForm";
import { useState, useEffect } from "react";
import { search, getDict } from "@/app/_utils/searchData";
import { useStopsInputs } from "@/app/_context/ContextProvider";

export default function ParadasPage() {
  const [stops, setStops] = useState([]);
  const [processedStops, setProcessedStops] = useState([]);
  const [types, setTypes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: null });
  const { stopsInputs: inputs, setStopsInputs: setInputs } = useStopsInputs();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/stops?`;

  useEffect(() => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/types`;
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

    let searchUrl = `${process.env.NEXT_PUBLIC_API_URL}/stops?`;
    search(searchUrl, inputs).then((res) => {
      setStops(res.data);
      setTotalPages(res.totalPages);
      setCurrentPage(1);
      setSortConfig({ key: "", direction: null });
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
          "Tipo",
          "Zona",
        ]}
        keys={[
          "RouteId",
          "Latitude",
          "Longitude",
          "OrderPosition",
          "StopId",
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
