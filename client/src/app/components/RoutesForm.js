"use client";
import { useState } from "react";
import Filter from "./Filter";
import { search } from "../utils/dataFetch";
import ButtonsForm from "./ButtonsForm";

export default function RoutesForm({ setRoutes, setIsLoading }) {
  const [inputs, setInputs] = useState({
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
  });

  const clearInputs = () => {
    setInputs({
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
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/routes?`;
    search(url, inputs).then((data) => {
      setIsLoading(false);
      setRoutes(data);
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
          name="id"
          value={inputs.id}
          placeholder="ID de la ruta"
          className={`w-44 p-2 rounded-md ${
            inputs.id ? "bg-sky-100 text-sky-800" : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          onChange={handleChange}
        />
        {inputs.score.map((score) => (
          <Filter
            key={score}
            field={"score"}
            text={score}
            setInputs={setInputs}
          />
        ))}
        <select
          name="score"
          className="p-2 rounded-md bg-slate-50 text-slate-400 outline-none"
          onChange={handleSelectChange}
        >
          <option value="">Añadir puntación</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {inputs.city.map((city) => (
          <Filter key={city} field={"city"} text={city} setInputs={setInputs} />
        ))}
        <select
          name="city"
          className="p-2 rounded-md bg-slate-50 text-slate-400 outline-none"
          onChange={handleSelectChange}
        >
          <option value="">Añadir ciudad</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Seattle">Seattle</option>
          <option value="Austin">Austin</option>
          <option value="Boston">Boston</option>
          <option value="Chicago">Chicago</option>
        </select>
        {inputs.station.map((station) => (
          <Filter
            key={station}
            field={"station"}
            text={station}
            setInputs={setInputs}
          />
        ))}
        <select
          name="station"
          className="p-2 rounded-md bg-slate-50 text-slate-400 outline-none"
          onChange={handleSelectChange}
        >
          <option value="">Añadir estación</option>
          <option value="DLA...">DLA...</option>
          <option value="DSE...">DSE...</option>
        </select>
        <div
          className={`p-2 flex justify-center items-center gap-2 rounded-md ${
            inputs.startDate
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
        >
          Desde
          <input
            type="date"
            className={`${
              inputs.startDate
                ? "bg-sky-100 text-sky-800"
                : "bg-slate-50 text-slate-400"
            }
          outline-none`}
            value={inputs.startDate}
            name="startDate"
            onChange={handleChange}
          />
        </div>
        <div
          className={`p-2 flex justify-center items-center gap-2 rounded-md ${
            inputs.endDate
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
        >
          Hasta
          <input
            type="date"
            className={`${
              inputs.endDate
                ? "bg-sky-100 text-sky-800"
                : "bg-slate-50 text-slate-400"
            }
          outline-none`}
            value={inputs.endDate}
            name="endDate"
            onChange={handleChange}
          />
        </div>

        <div
          className={`p-2 flex justify-center items-center gap-2 rounded-md ${
            inputs.startTime
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
        >
          Desde
          <input
            type="time"
            className={`${
              inputs.startTime
                ? "bg-sky-100 text-sky-800"
                : "bg-slate-50 text-slate-400"
            }
          outline-none`}
            value={inputs.startTime}
            name="startTime"
            onChange={handleChange}
          />
        </div>

        <div
          className={`p-2 flex justify-center items-center gap-2 rounded-md ${
            inputs.endTime
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
        >
          Hasta
          <input
            type="time"
            className={`${
              inputs.endTime
                ? "bg-sky-100 text-sky-800"
                : "bg-slate-50 text-slate-400"
            }
          outline-none`}
            value={inputs.endTime}
            name="endTime"
            onChange={handleChange}
          />
        </div>
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.lowCapacity
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.lowCapacity}
          placeholder="Capacidad mínima"
          name="lowCapacity"
          onChange={handleChange}
        />
        <input
          type="number"
          className={`w-36 p-2 rounded-md ${
            inputs.highCapacity
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          value={inputs.highCapacity}
          placeholder="Capacidad máxima"
          name="highCapacity"
          onChange={handleChange}
        />
      </div>
      <ButtonsForm clearInputs={clearInputs} />
    </form>
  );
}
