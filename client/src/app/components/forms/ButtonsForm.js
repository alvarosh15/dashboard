export default function ButtonsForm({
  clearInputs,
  setInputs,
  inputs,
  handleSearch,
}) {
  const handleLimitChange = (event) => {
    const newLimit = event.target.value;
    setInputs((prevInputs) => ({
      ...prevInputs,
      limit: newLimit,
    }));
  };

  return (
    <div className="flex flex-row gap-2 justify-end">
      <select
        value={inputs.limit}
        onChange={handleLimitChange}
        className="bg-sky-100 text-sky-800 rounded-md p-2 outline-none"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
      <button
        onClick={clearInputs}
        type="button"
        className="bg-sky-100 text-sky-800 rounded-md p-2"
      >
        Limpiar filtros
      </button>
      <button className="bg-sky-100 text-sky-800 rounded-md p-2" type="submit">
        Buscar
      </button>
    </div>
  );
}
