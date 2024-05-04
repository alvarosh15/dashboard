"use client";
import { useState } from "react";
import Filter from "./Filter";
import ButtonsForm from "./ButtonsForm";
import { search } from "../utils/dataFetch";

export default function StopsForm({ setStops, setIsLoading }) {
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
  });

  const clearInputs = () => {
    setInputs({
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
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/stops?`;
    search(url, inputs).then((data) => {
      setIsLoading(false);
      setStops(data);
    });
  };

  const handleSelectChange = (event) => {
    let field = event.target.name;
    const selectedValue = event.target.value;
    setInputs((prevInputs) => {
      const updatedValues = new Set(prevInputs[field]);
      updatedValues.add(selectedValue);

      return {
        ...prevInputs,
        [field]: Array.from(updatedValues),
      };
    });
    event.target.value = "";
  };

  const handleChange = (event) => {
    let field = event.target.name;
    const selectedValue = event.target.value;
    setInputs((prevInputs) => {
      return {
        ...prevInputs,
        [field]: selectedValue,
      };
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col bg-white rounded-md shadow-sm gap-2 p-3"
    >
      <div className="flex flex-wrap justify-start gap-2">
        <input
          name="routeId"
          value={inputs.routeId}
          placeholder="ID de la ruta"
          className={`w-44 p-2 rounded-md ${
            inputs.routeId
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          onChange={handleChange}
        />
        <input
          name="id"
          value={inputs.id}
          placeholder="ID de la parada"
          className={`w-44 p-2 rounded-md ${
            inputs.id ? "bg-sky-100 text-sky-800" : "bg-slate-50 text-slate-400"
          }
        outline-none`}
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.lowLatitude
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.lowLatitude}
          placeholder="Latitud mínima"
          name="lowLatitude"
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.highLatitude
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.highLatitude}
          placeholder="Latitud máxima"
          name="highLatitude"
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.lowLongitude
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.lowLongitude}
          placeholder="Longitud mínima"
          name="lowLongitude"
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.highLongitude
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.highLongitude}
          placeholder="Longitud máxima"
          name="highLongitude"
          onChange={handleChange}
        />
        {inputs.type.map((type) => (
          <Filter key={type} field={"type"} text={type} setInputs={setInputs} />
        ))}
        <select
          name="type"
          className="p-2 rounded-md bg-slate-50 text-slate-400 outline-none"
          onChange={handleSelectChange}
        >
          <option value="">Añadir tipo</option>
          <option value="Station">Station</option>
          <option value="Dropoff">Dropoff</option>
        </select>
        <input
          name="zoneId"
          value={inputs.zoneId}
          placeholder="ID de la zona"
          className={`w-44 p-2 rounded-md ${
            inputs.zoneId
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.posicion
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.posicion}
          placeholder="Posición"
          name="posicion"
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.lowTimeToNext
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
        outline-none`}
          value={inputs.lowTimeToNext}
          placeholder="Tiempo mínimo al siguiente"
          name="lowTimeToNext"
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.highTimeToNext
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
        outline-none`}
          value={inputs.highTimeToNext}
          placeholder="Tiempo máximo al siguiente"
          name="highTimeToNext"
          onChange={handleChange}
        />
      </div>
      <ButtonsForm clearInputs={clearInputs} />
    </form>
  );
}
