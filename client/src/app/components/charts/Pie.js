"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Pie({ data, title, colorPalette, hole = 0 }) {
  return (
    <Plot
      data={[
        {
          ...data,
          type: "pie",
          marker: {
            colors: colorPalette,
          },
          hole: hole,
        },
      ]}
      layout={{
        responsive: true,
        useResizeHandler: true,
        autosize: true,
        title: `${title}`,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          color: "#075985",
        },
        legend: { orientation: "h" },
        margin: { t: 50, b: 50, l: 50, r: 50 },
      }}
      useResizeHandler={true}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="rounded-md bg-white shadow-sm"
    />
  );
}
