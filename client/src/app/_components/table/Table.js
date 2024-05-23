import { search } from "@/app/_utils/searchData";
import { useCurrentIds } from "@/app/_context/ContextProvider";

export default function Table({
  headers,
  data,
  setData,
  keys,
  sortConfig,
  setSortConfig,
  inputs,
  setCurrentPage,
  url,
}) {
  const requestSort = (key) => {
    let sort = { key, direction: "ASC" };
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "ASC") {
        sort.direction = "DESC";
      } else if (sortConfig.direction === "DESC") {
        sort.direction = null;
        sort.key = "";
      }
    }
    setSortConfig(sort);
    setCurrentPage(1);
    search(url, inputs, sort).then((res) => {
      setData(res.data);
    });
  };

  const { ids, setIds } = useCurrentIds();

  const addToMap = (id) => {
    if (ids.includes(id)) {
      const newIds = ids.filter((routeId) => routeId !== id);
      setIds(newIds);
    } else {
      const newIds = [...ids, id];
      setIds(newIds);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-around md:hidden">
        {data.map((item, index) => (
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
                {sortConfig && sortConfig.key === keys[index] && (
                  <span>
                    {sortConfig.direction === "ASC"
                      ? "▲"
                      : sortConfig.direction === "DESC"
                      ? "▼"
                      : ""}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((elem, index) => (
              <tr className="font-mono text-center" key={index}>
                {keys.map((key, index) => (
                  <td key={index}>
                    {key === "RouteId" ? (
                      <div className="flex justify-center items-center gap-1">
                        <span onClick={() => addToMap(elem[key])}>
                          {ids.includes(elem[key]) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-geo-alt-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-geo-alt"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                          )}
                        </span>
                        {elem[key]}
                      </div>
                    ) : elem[key] ? (
                      elem[key]
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
