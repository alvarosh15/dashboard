"use client";
import { useState, useEffect } from "react";
import { getDict } from "../../utils/dataFetch";
import PackagesForm from "../../components/forms/PackagesForm";
import TableWithPages from "../../components/table/TableWithPages";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [processedPackages, setProcessedPackages] = useState([]);
  const [status, setStatus] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: null });
  const [inputs, setInputs] = useState({
    id: "",
    state: [],
    startTimeWindow: "",
    endTimeWindow: "",
    lowPlannedServiceTime: "",
    highPlannedServiceTime: "",
    minDepth: "",
    maxDepth: "",
    minHeight: "",
    maxHeight: "",
    minWidth: "",
    maxWidth: "",
    routeId: "",
    stopId: "",
    limit: 20,
  });
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/packages?`;

  useEffect(() => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/status`;
    let dict_status = {
      DELIVERY_ATTEMPTED: "Intento de entrega",
      DELIVERED: "Entregado",
      REJECTED: "Rechazado",
    };

    getDict(url, "Status").then((data) => {
      for (const key in data) {
        data[key] = dict_status[data[key]];
      }
      setStatus(data);
    });
  }, []);

  useEffect(() => {
    if (packages.length > 0) {
      const newPackages = packages.map((pack) => {
        return {
          ...pack,
          StatusId: pack.StatusId ? status[pack.StatusId] : "-",
        };
      });
      setProcessedPackages(newPackages);
    } else {
      setProcessedPackages([]);
    }
  }, [packages, status]);

  return (
    <div className="flex flex-col gap-4">
      <PackagesForm
        setPackages={setPackages}
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
        setInputs={setInputs}
        inputs={inputs}
        setSortConfig={setSortConfig}
      />

      <TableWithPages
        headers={[
          "Código del paquete",
          "Estado",
          "Hora de inicio de entrega",
          "Hora de fin de entrega",
          "Tiempo de servicio planeado",
          "Profundidad",
          "Altura",
          "Ancho",
          "Código de la ruta",
          "Código de la parada",
        ]}
        keys={[
          "PackageId",
          "StatusId",
          "StartTimeWindow",
          "EndTimeWindow",
          "PlannedServiceTime",
          "Depth",
          "Height",
          "Width",
          "RouteId",
          "StopId",
        ]}
        data={processedPackages}
        setData={setPackages}
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
