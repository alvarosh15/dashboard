"use client";
import { useSession } from "next-auth/react";
import { search } from "@/app/_utils/searchData";
import { addSearchHistory } from "@/app/_utils/history";
import Filter from "@/app/_components/forms/Filter";
import ButtonsForm from "@/app/_components/forms/ButtonsForm";
import NumberInput from "@/app/_components/forms/NumberInput";
import IntervalInput from "@/app/_components/forms/IntervalInput";

export default function PackagesForm({
  setPackages,
  setTotalPages,
  setInputs,
  inputs,
  setCurrentPage,
  setSortConfig,
}) {
  const { data: session } = useSession();
  const clearInputs = () => {
    setInputs({
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
    setPackages([]);
    setCurrentPage(1);
    setSortConfig({ key: "", direction: null });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `${process.env.NEXT_PUBLIC_API_URL}/packages?`;
    search(url, inputs).then((res) => {
      setPackages(res.data);
      setTotalPages(res.totalPages);
      setCurrentPage(1);
      setSortConfig({ key: "", direction: null });
    });
    if (session) {
      addSearchHistory(inputs, "Package");
    }
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
          placeholder="ID del paquete"
          className={`w-44 p-2 rounded-md ${
            inputs.id ? "bg-sky-100 text-sky-800" : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          onChange={handleChange}
        />
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
          name="stopId"
          value={inputs.stopId}
          placeholder="ID de la parada"
          className={`w-44 p-2 rounded-md ${
            inputs.stopId
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
          outline-none`}
          onChange={handleChange}
        />
        {inputs.state.map((state) => (
          <Filter
            key={state}
            field={"state"}
            text={state}
            setInputs={setInputs}
          />
        ))}
        <select
          name="state"
          className="p-2 rounded-md bg-slate-50 text-slate-400 outline-none"
          style={{ "-webkit-appearance": "none" }}
          onChange={handleSelectChange}
        >
          <option value="">Añadir estado</option>
          <option value="Entregado">Entregado</option>
          <option value="Intento de entrega">Intento de entrega</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Sin datos">Sin datos</option>
        </select>

        <IntervalInput
          inputs={inputs}
          start={"startTimeWindow"}
          end={"endTimeWindow"}
          handleChange={handleChange}
          type="datetime-local"
        />
        <NumberInput
          inputs={inputs}
          field={"lowPlannedServiceTime"}
          placeHolder={"Mín. tiempo de servicio planeado"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"highPlannedServiceTime"}
          placeHolder={"Máx. tiempo de servicio planeado"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"minDepth"}
          placeHolder={"Profundidad mínima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"maxDepth"}
          placeHolder={"Profundidad máxima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"minHeight"}
          placeHolder={"Altura mínima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"maxHeight"}
          placeHolder={"Altura máxima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"minWidth"}
          placeHolder={"Anchura mínima"}
          handleChange={handleChange}
        />
        <NumberInput
          inputs={inputs}
          field={"maxWidth"}
          placeHolder={"Anchura máxima"}
          handleChange={handleChange}
        />
      </div>
      <ButtonsForm
        clearInputs={clearInputs}
        setInputs={setInputs}
        inputs={inputs}
        type={"packages"}
      />
    </form>
  );
}
