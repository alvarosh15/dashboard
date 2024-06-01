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
      className={`${
        activeId === id
          ? editIds
            ? "bg-red-200 text-red-800"
            : "bg-sky-100"
          : ""
      } ${
        editIds ? "bg-red-100 text-red-800" : "text-sky-800"
      } p-2 rounded-md cursor-pointer font-mono`}
    >
      {id}
    </div>
  );
}
