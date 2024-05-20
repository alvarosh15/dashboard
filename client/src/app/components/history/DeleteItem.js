
export default function DeleteItem({ handleDelete }) {
  return (
    <button
      type="button"
      onClick={() => handleDelete()}
      className="opacity-0 group-hover:opacity-100 bg-red-100 text-red-800 p-2 rounded-md"
    >
      Eliminar
    </button>
  );
}
