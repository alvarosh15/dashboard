"use client";
import Filter from "./Filter";
import { search, addSearchHistory } from "../../utils/dataFetch";
import ButtonsForm from "./ButtonsForm";
import IntervalInput from "./IntervalInput";
import NumberInput from "./NumberInput";

export default function RoutesForm({
  setRoutes,
  setTotalPages,
  setInputs,
  inputs,
  setCurrentPage,
  setSortConfig,
  stationCodes,
}) {
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
      limit: 20,
    });
    setRoutes([]);
    setCurrentPage(1);
    setSortConfig({ key: "", direction: null });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `${process.env.NEXT_PUBLIC_API_URL}/routes?`;
    search(url, inputs).then((res) => {
      setRoutes(res.data);
      setTotalPages(res.totalPages);
      setCurrentPage(1);
      setSortConfig({ key: "", direction: null });
    });
    addSearchHistory(inputs, "Route");
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
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
          <option value="Sin datos">Sin datos</option>
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
          {stationCodes.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
        <IntervalInput
          inputs={inputs}
          start={"startDate"}
          end={"endDate"}
          handleChange={handleChange}
          type="date"
        />
        <IntervalInput
          inputs={inputs}
          start={"startTime"}
          end={"endTime"}
          handleChange={handleChange}
          type="time"
        />
        <NumberInput
          inputs={inputs}
          field={"lowCapacity"}
          placeHolder={"Capacidad mínima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"highCapacity"}
          placeHolder={"Capacidad máxima"}
          handleChange={handleChange}
        />
      </div>
      <ButtonsForm
        clearInputs={clearInputs}
        setInputs={setInputs}
        inputs={inputs}
      />
    </form>
  );
}
