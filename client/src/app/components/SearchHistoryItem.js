"use client";
import { useRoutesInputs } from "@/app/context/ContextProvider";
import { useStopsInputs } from "@/app/context/ContextProvider";
import { usePackagesInputs } from "@/app/context/ContextProvider";
import Link from "next/link";

const keyDictionary = {
  startDate: "Fecha de inicio ≥",
  endDate: "Fecha de inicio ≤",
  startTime: "Hora de inicio ≥",
  endTime: "Hora de inicio ≤",
  lowCapacity: "Capacidad mínima:",
  highCapacity: "Capacidad máxima:",
  lowLatitude: "Latitud mínima:",
  highLatitude: "Latitud máxima:",
  lowLongitude: "Longitud mínima:",
  highLongitude: "Longitud máxima:",
  lowTimeToNext: "Mínimo tiempo al siguiente:",
  highTimeToNext: "Máximo tiempo al siguiente:",
  startTimeWindow: "Entrega desde:",
  endTimeWindow: "Entrega hasta:",
  lowPlannedServiceTime: "Mín. tiempo de servicio planeado:",
  highPlannedServiceTime: "Máx. tiempo de servicio planeado:",
  minDepth: "Mínima profundidad:",
  maxDepth: "Máxima profundidad:",
  minHeight: "Mínima altura:",
  maxHeight: "Máxima altura:",
  minWidth: "Mínima anchura:",
  maxWidth: "Máxima anchura:",
};

export default function SearchHistoryItem({ item, type }) {
  const href =
    type === "Rutas"
      ? "/datos/rutas"
      : type === "Paradas"
      ? "/datos/paradas"
      : "/datos/paquetes";
  const values = [];
  const { routesInputs, setRoutesInputs } = useRoutesInputs();
  const { stopsInputs, setStopsInputs } = useStopsInputs();
  const { packagesInputs, setPackagesInputs } = usePackagesInputs();
  for (const key in item) {
    if (key !== "limit" && Array.isArray(item[key])) {
      values.push(
        ...item[key].map((value) =>
          keyDictionary[key] ? `${keyDictionary[key]} ${value}` : value
        )
      );
    } else if (key !== "limit" && item[key]) {
      values.push(
        keyDictionary[key] ? `${keyDictionary[key]} ${item[key]}` : item[key]
      );
    }
  }

  const handleClick = () => {
    if (type === "Rutas") {
      setRoutesInputs(item);
    } else if (type === "Paradas") {
      setStopsInputs(item);
    } else {
      setPackagesInputs(item);
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row justify-center items-center gap-2">
        {values.length > 0 ? (
          values.map((value, index) => (
            <div
              key={index}
              className="flex flex-row w-fit group justify-center items-center bg-sky-100 text-sky-800 rounded-md p-2"
            >
              {value}
            </div>
          ))
        ) : (
          <div className="flex flex-row w-fit group justify-center items-center bg-sky-100 text-sky-800 rounded-md p-2">
            Sin filtros
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2 ml-auto">
        <Link href={href}>
          <button
            className="bg-sky-100 text-sky-800 rounded-md p-2"
            onClick={handleClick}
          >
            Buscar
          </button>
        </Link>
      </div>
    </div>
  );
}
