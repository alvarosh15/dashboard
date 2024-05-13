"use client";

import { createContext, useContext, useState } from "react";

const mapContext = createContext([]);
export const useCurrentIds = () => useContext(mapContext);

const routesContext = createContext({});
export const useRoutesInputs = () => useContext(routesContext);

const stopsContext = createContext({});
export const useStopsInputs = () => useContext(stopsContext);

const packagesContext = createContext({});
export const usePackagesInputs = () => useContext(packagesContext);

export default function ContextProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [routesInputs, setRoutesInputs] = useState({
    id: "",
    city: [],
    station: [],
    score: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    lowCapacity: "",
    highCapacity: "",
    limit: 20,
  });
  const [stopsInputs, setStopsInputs] = useState({
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
  const [packagesInputs, setPackagesInputs] = useState({
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

  return (
    <mapContext.Provider value={{ ids, setIds }}>
      <routesContext.Provider value={{ routesInputs, setRoutesInputs }}>
        <stopsContext.Provider value={{ stopsInputs, setStopsInputs }}>
          <packagesContext.Provider
            value={{ packagesInputs, setPackagesInputs }}
          >
            {children}
          </packagesContext.Provider>
        </stopsContext.Provider>
      </routesContext.Provider>
    </mapContext.Provider>
  );
}
