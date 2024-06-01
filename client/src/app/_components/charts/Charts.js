"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export const Pie = ({
  data,
  dataConfig,
  layoutConfig,
  title,
  colorPalette,
}) => {
  return (
    <Plot
      data={[
        {
          ...data,
          ...dataConfig,
          type: "pie",
          marker: {
            colors: colorPalette,
          },
        },
      ]}
      layout={{
        ...layoutConfig,
        responsive: true,
        useResizeHandler: true,
        autosize: true,
        title: `${title}`,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          color: "#075985",
        },
        legend: {
          orientation: "h",
        },
        margin: { t: 50, b: 20, l: 20, r: 20 },
      }}
      useResizeHandler={true}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="rounded-md bg-white shadow-sm"
    />
  );
};

export const Bar = ({
  data,
  dataConfig,
  layoutConfig,
  title,
  colorPalette,
}) => {
  return (
    <Plot
      data={[
        {
          ...data,
          ...dataConfig,
          type: "bar",
          marker: {
            color: colorPalette,
          },
        },
      ]}
      layout={{
        ...layoutConfig,
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
};

export const Lines = ({
  data,
  dataConfig,
  layoutConfig,
  title,
  colorPalette,
}) => {
  return (
    <Plot
      data={[
        {
          ...data,
          ...dataConfig,
          type: "lines",
          marker: {
            color: colorPalette,
          },
        },
      ]}
      layout={{
        ...layoutConfig,
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
};

export const Block = ({ data, title, colorPalette }) => {
  return (
    <div className="flex flex-col justify-center items-center rounded-md h-full w-full bg-white text-sky-800 shadow-sm p-4">
      <h2 className="text-xl font-semibold text-center">{title}</h2>
      {data &&
        Object.entries(data).map(([key, value], index) => (
          <div
            key={index}
            className="flex flex-row gap-6 justify-center items-center"
          >
            <h3 className="text-xl font-medium">{key}:</h3>
            <p className="text-lg" style={{ color: colorPalette }}>
              {value}
            </p>
          </div>
        ))}
    </div>
  );
};
