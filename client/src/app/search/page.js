"use client";

export default function Search() {
  let searchById = (e) => {
    e.preventDefault();
    let id = e.target[0].value;
    console.log(`Buscando ruta con id: ${id}`);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={searchById}>
        <input
          type="search"
          placeholder="Busca una ruta a través de su id..."
          required
        />
        <button className="bg-sky-200 rounded-md p-2" type="submit">
          Buscar
        </button>
      </form>
      Esta es la página de búsqueda
    </div>
  );
}
