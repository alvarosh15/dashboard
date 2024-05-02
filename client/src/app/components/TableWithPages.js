"use client";
import DataPagination from "./DataPagination.js";
import Table from "./Table.js";
import { useState } from "react";

export default function RouteTable({ data, headers, keys }) {
  const [currentItems, setCurrentItems] = useState([]);

  return (
    <div>
      {data.length > 0 ? (
        <div className="rounded-md bg-white shadow-md p-3">
          <DataPagination data={data} setCurrentItems={setCurrentItems} />
          <Table headers={headers} keys={keys} currentItems={currentItems} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
