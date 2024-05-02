"use client";
import TableWithPages from "../../components/table/TableWithPages";
import { useState, useEffect } from "react";
import { search } from "../../utils/dataFetch";

export default function ParadasPage() {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    let inputs = [];
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/stops?`;
    search(url, inputs).then((data) => {
      console.log(data);
      setStops(data);
    });
  }, []);

  return (
    <div>
      <TableWithPages
        headers={[
          "Latitud",
          "Longitud",
          "Orden",
          "Codigo de la parada",
          "Tiempo al siguiente",
          "Tipo",
          "Zona",
        ]}
        keys={[
          "Latitude",
          "Longitude",
          "OrderPosition",
          "StopId",
          "TimeToNext",
          "TypeId",
          "ZoneId",
        ]}
        data={stops}
        setData={setStops}
      />
    </div>
  );
}
