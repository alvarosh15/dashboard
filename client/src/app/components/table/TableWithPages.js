"use client";
import DataPagination from "./Pagination.js";
import Table from "./Table.js";
import { useState, useMemo } from "react";

export default function TableWithPages({ data, headers, keys }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: null,
  });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.direction !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    } else {
      sortableItems = data;
    }
    return sortableItems;
  }, [data, sortConfig]);

  return (
    <div>
      {data.length > 0 ? (
        <div className="rounded-md bg-transparent md:bg-white md:shadow-sm p-3 ">
          <Table headers={headers} keys={keys} sortConfig={sortConfig} setSortConfig={setSortConfig} currentItems={currentItems} />
          <DataPagination data={sortedData} setCurrentItems={setCurrentItems} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
