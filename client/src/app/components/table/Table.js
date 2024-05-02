export default function Table({
  headers,
  setSortConfig,
  sortConfig,
  currentItems,
  keys,
}) {
  const requestSort = (key) => {
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      setSortConfig({ key, direction: "descending" });
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      setSortConfig({ key, direction: null });
    } else {
      setSortConfig({ key, direction: "ascending" });
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-around md:hidden">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-md p-4 m-2 w-full"
          >
            {keys.map((key, index) => (
              <div key={index} className="text-sky-800">
                <strong>{headers[index]}:</strong> {item[key]}
              </div>
            ))}
          </div>
        ))}
      </div>

      <table className="text-sky-800 hidden md:table table-auto text-sm w-full mb-2">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                className="text-center cursor-pointer"
                onClick={() => requestSort(keys[index])}
                key={index}
              >
                {header}
                {sortConfig.key == keys[index] && (
                  <span className="text-sky-800">
                    {sortConfig.direction === "ascending"
                      ? "▲"
                      : sortConfig.direction == null
                      ? ""
                      : "▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 &&
            currentItems.map((route, index) => (
              <tr className="font-mono text-center" key={index}>
                {keys.map((key, index) => (
                  <td key={index}>{route[key]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
