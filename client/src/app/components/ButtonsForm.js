export default function ButtonsForm({ clearInputs }) {
  return (
    <div className="flex flex-row gap-2 justify-end">
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
