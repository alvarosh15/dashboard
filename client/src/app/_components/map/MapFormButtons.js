export default function MapFormButtons({ editIds, setEditIds }) {
  return (
    <div className="flex flex-row gap-2 justify-end">
      <button
        type="button"
        onClick={() => setEditIds(!editIds)}
        className={`${
          editIds ? "bg-red-100 text-red-800" : "bg-sky-100 text-sky-800"
        } p-2 rounded-md`}
      >
        Editar rutas
      </button>
      <button type="submit" className="bg-sky-100 text-sky-800 rounded-md p-2">
        Añadir ruta
      </button>
    </div>
  );
}
