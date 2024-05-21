"use client";
import { useState, useEffect } from "react";
import { getLocAndLatFromId } from "@/app/utils/map";
import { useCurrentIds } from "@/app/context/ContextProvider";
import Map from "@/app/components/map/Map.js";
import RouteSelector from "@/app/components/map/RouteSelector";
import MapFormButtons from "@/app/components/map/MapFormButtons";

export default function MapPage() {
  const { ids, setIds } = useCurrentIds();
  const [inputId, setInputId] = useState("");
  const [activeId, setActiveId] = useState(ids.length > 0 ? ids[0] : "");
  const [data, setData] = useState({ lat: [], lon: [] });
  const [editIds, setEditIds] = useState(false);

  useEffect(() => {
    if (activeId.length === 0) return;
    getLocAndLatFromId(activeId).then((data) => {
      setData(data);
    });
  }, [activeId]);

  const addRoute = (e) => {
    e.preventDefault();
    if (e.target.id.value === "") return;
    if (ids.length === 0) {
      setInputId("");
      setActiveId(e.target.id.value);
    }
    if (ids.includes(e.target.id.value)) {
      setInputId("");
      setActiveId(e.target.id.value);
    } else {
      const newRoutes = [...ids, e.target.id.value];
      setInputId("");
      setIds(newRoutes);
    }
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <form
        className="w-full flex flex-wrap bg-white rounded-md shadow-sm gap-2 p-3"
        onSubmit={addRoute}
      >
        {ids.map((id) => (
          <RouteSelector
            key={id}
            id={id}
            ids={ids}
            setIds={setIds}
            editIds={editIds}
            setActiveId={setActiveId}
            activeId={activeId}
          />
        ))}
        <input
          name="id"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="ID de la ruta"
          className={
            "w-44 p-2 rounded-md bg-slate-50 text-slate-400 outline-none"
          }
        />
        <MapFormButtons editIds={editIds} setEditIds={setEditIds} />
      </form>
      <div className="w-full h-3/4 flex justify-center items-center">
        {activeId.length > 0 ? (
          <Map data={data} />
        ) : (
          <p className="text-sky-800 text-2xl font-semibold">
            Añade una ruta para comenzar
          </p>
        )}
      </div>
    </div>
  );
}
