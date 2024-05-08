"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Map({ data, title, colorPalette }) {
  return (
    <Plot
      data={[
        {
          ...data,
          type: "scattergeo",
          mode: "markers",
          name: "Route",
        },
      ]}
      layout={{
        title: "Ruta",
        titlefont: {
          size: 32,
        },
        geo: {
          scope: "north america",
          fitbounds: "locations",
          resolution: 50,
          lonaxis: {
            range: [-130, -55],
          },
          lataxis: {
            range: [40, 70],
          },
          showrivers: true,
          rivercolor: "#fff",
          showlakes: true,
          lakecolor: "#fff",
          showland: true,
          landcolor: "#EAEAAE",
          countrycolor: "#d3d3d3",
          countrywidth: 1.5,
          subunitcolor: "#d3d3d3",
        },
      }}
    />
  );
}
