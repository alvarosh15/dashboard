"use client";
import Filter from "./Filter";
import ButtonsForm from "./ButtonsForm";
import { search, addSearchHistory } from "../../utils/dataFetch";
import NumberInput from "./NumberInput";

export default function StopsForm({
  setStops,
  setTotalPages,
  setInputs,
  inputs,
  setCurrentPage,
  setSortConfig,
}) {
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
      limit: 20,
    });
    setStops([]);
    setCurrentPage(1);
    setSortConfig({ key: "", direction: null });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    let url = `${process.env.NEXT_PUBLIC_API_URL}/stops?`;
    search(url, inputs).then((res) => {
      setStops(res.data);
      setTotalPages(res.totalPages);
      setCurrentPage(1);
      setSortConfig({ key: "", direction: null });
    });
    addSearchHistory(inputs, "Stop");
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
        <NumberInput
          inputs={inputs}
          field={"lowLatitude"}
          placeHolder={"Latitud mínima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"highLatitude"}
          placeHolder={"Latitud máxima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"lowLongitude"}
          placeHolder={"Longitud mínima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"highLongitude"}
          placeHolder={"Longitud máxima"}
          handleChange={handleChange}
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
          <option value="Almacen">Almacen</option>
          <option value="Entrega">Entrega</option>
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
        <NumberInput
          inputs={inputs}
          field={"posicion"}
          placeHolder={"Posición"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"lowTimeToNext"}
          placeHolder={"Tiempo mínimo al siguiente"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"highTimeToNext"}
          placeHolder={"Tiempo máximo al siguiente"}
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
