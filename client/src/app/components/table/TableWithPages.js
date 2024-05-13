import Pagination from "./Pagination.js";
import Table from "./Table.js";

export default function TableWithPages({
  headers,
  keys,
  data,
  setData,
  totalPages,
  inputs,
  url,
  currentPage,
  setCurrentPage,
  sortConfig,
  setSortConfig,
}) {
  return (
    <div>
      {data.length > 0 ? (
        <div className="rounded-md bg-transparent md:bg-white md:shadow-sm p-3 ">
          <Table
            headers={headers}
            keys={keys}
            inputs={inputs}
            data={data}
            setData={setData}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            setCurrentPage={setCurrentPage}
            url={url}
          />
          <Pagination
            setData={setData}
            totalPages={totalPages}
            inputs={inputs}
            url={url}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            sortConfig={sortConfig}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
