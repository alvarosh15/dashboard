export default function RouteSelector({
  id,
  ids,
  setIds,
  editIds,
  setActiveId,
  activeId,
}) {
  const handleClick = () => {
    if (editIds) {
      const newIds = ids.filter((routeId) => routeId !== id);
      setIds(newIds);
      return;
    } else {
      setActiveId(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${activeId === id ? "bg-sky-100" : ""} ${
        editIds ? "bg-red-100 text-red-800" : ""
      } p-2 rounded-md cursor-pointer text-sky-800 font-mono`}
    >
      {id}
    </div>
  );
}
