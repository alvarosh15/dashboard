import { useRoutesInputs } from "@/app/_context/ContextProvider";
import { useStopsInputs } from "@/app/_context/ContextProvider";
import { usePackagesInputs } from "@/app/_context/ContextProvider";
import Link from "next/link";
import DeleteItem from "@/app/_components/history/DeleteItem";
import { deleteHistoryItem } from "@/app/_utils/history";

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

export default function SearchHistoryItem({
  item,
  type,
  setDeletedItem,
  deletedItem,
}) {
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
  const input = item.Input;
  for (const key in input) {
    if (key !== "limit" && Array.isArray(input[key])) {
      values.push(
        ...input[key].map((value) =>
          keyDictionary[key] ? `${keyDictionary[key]} ${value}` : value
        )
      );
    } else if (key !== "limit" && input[key]) {
      values.push(
        keyDictionary[key] ? `${keyDictionary[key]} ${input[key]}` : input[key]
      );
    }
  }

  const handleClick = () => {
    if (type === "Rutas") {
      setRoutesInputs(input);
    } else if (type === "Paradas") {
      setStopsInputs(input);
    } else {
      setPackagesInputs(input);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHistoryItem(item.Id);
      setDeletedItem(!deletedItem);
    } catch (error) {
      console.error("Error al eliminar el elemento del historial:", error);
    }
  };

  return (
    <div className="group flex flex-row items-center gap-2">
      <div className="flex flex-wrap justify-start items-center gap-2">
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
        <DeleteItem handleDelete={handleDelete} />
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
