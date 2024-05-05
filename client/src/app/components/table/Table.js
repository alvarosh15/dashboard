import { search } from "@/app/utils/dataFetch";

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
            data.map((route, index) => (
              <tr className="font-mono text-center" key={index}>
                {keys.map((key, index) => (
                  <td key={index}>{route[key]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
