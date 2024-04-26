"use client";

export default function Search() {
  let searchById = (e) => {
    e.preventDefault();
    let id = e.target[0].value;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/routes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={searchById}>
        <input
          type="search"
          placeholder="Busca una ruta a través de su id..."
        />
        <button className="bg-sky-200 rounded-md p-2" type="submit">
          Buscar
        </button>
      </form>
      Esta es la página de búsqueda 00143bdd-0a6b-49ec-bb35-36593d303e77
    </div>
  );
}
