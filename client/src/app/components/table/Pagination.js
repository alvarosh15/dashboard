"use client";
import { useState, useEffect, useCallback } from "react";
import { search } from "../../utils/dataFetch";

export default function DataPagination({
  totalPages,
  inputs,
  setData,
  url,
  currentPage,
  setCurrentPage,
  sortConfig,
}) {
  const [delta, setDelta] = useState(2);

  const changePage = useCallback(
    (pageNumber) => {
      search(url, inputs, sortConfig, pageNumber).then((res) => {
        setCurrentPage(pageNumber);
        setData(res.data);
      });
    },
    [inputs, url, setData, setCurrentPage, sortConfig]
  );

  useEffect(() => {
    const getResponsiveDelta = () => {
      const width = window.innerWidth;
      if (width < 640) return 2;
      else if (width < 768) return 3;
      else return 4;
    };

    setDelta(getResponsiveDelta());

    const handleResize = () => {
      setDelta(getResponsiveDelta());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getPageRange(current, total, delta) {
    let range = [];
    let start = 1;
    let end = total;

    if (current <= delta + 1) {
      start = 1;
      end = Math.min(total, 2 * delta);
    } else if (current >= total - delta) {
      start = Math.max(1, total - 2 * delta + 1);
      end = total;
    } else {
      start = current - delta;
      end = current + delta - 1;
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  const pageNumbers = getPageRange(currentPage, totalPages, delta);

  return (
    <div className="flex justify-center gap-2">
      <button className="text-slate-400" onClick={() => changePage(1)}>
        {"<<"}
      </button>
      {pageNumbers.map((num, index) => (
        <button
          key={index}
          onClick={() => changePage(num)}
          className={`${
            num == currentPage
              ? "bg-sky-100 text-sky-800 text-center"
              : "text-slate-400"
          } font-medium p-2 rounded-md`}
        >
          {num}
        </button>
      ))}
      <button className="text-slate-400" onClick={() => changePage(totalPages)}>
        {">>"}
      </button>
    </div>
  );
}
