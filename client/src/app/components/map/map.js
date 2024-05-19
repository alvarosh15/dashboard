"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Map({ data }) {
  const centerLat = data.lat && data.lat.length > 0 ? data.lat[0] : 0;
  const centerLon = data.lon && data.lon.length > 0 ? data.lon[0] : 0;
  return (
    <Plot
      data={[
        {
          ...data,
          type: "scattermapbox",
          mode: "markers",
          text: data.type,
        },
      ]}
      config={{ mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN }}
      style={{
        width: "100%",
        height: "100%",
      }}
      layout={{
        mapbox: {
          center: {
            lat: centerLat,
            lon: centerLon,
          },
          zoom: 10,
        },
        responsive: true,
        useResizeHandler: true,
        autosize: true,
        margin: {
          l: 0,
          r: 0,
          t: 0,
          b: 0,
        },
      }}
    />
  );
}
