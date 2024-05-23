import axiosInstance from "@/app/_utils/axiosInstance";

const buildUrlWithParams = (baseUrl, params) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) {
      params[key].forEach((value) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });
    } else {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    }
  });
  return url.toString();
};

export const downloadCsv = async (inputs, type) => {
  try {
    let baseUrl = "";
    let params = {};
    if (type === "routes") {
      baseUrl = process.env.NEXT_PUBLIC_API_URL + "/routes/download_csv";
      params = {
        id: inputs.id,
        score: inputs.score,
        city: inputs.city,
        station: inputs.station,
        startDate: inputs.startDate,
        endDate: inputs.endDate,
        startTime: inputs.startTime,
        endTime: inputs.endTime,
        lowCapacity: inputs.lowCapacity,
        highCapacity: inputs.highCapacity,
        sort: inputs.sortKey,
        direction: inputs.sortDirection,
      };
    } else if (type === "stops") {
      baseUrl = process.env.NEXT_PUBLIC_API_URL + "/stops/download_csv";
      params = {
        routeId: inputs.routeId,
        id: inputs.id,
        lowLatitude: inputs.lowLatitude,
        highLatitude: inputs.highLatitude,
        lowLongitude: inputs.lowLongitude,
        highLongitude: inputs.highLongitude,
        type: inputs.type,
        zoneId: inputs.zoneId,
        posicion: inputs.posicion,
        lowTimeToNext: inputs.lowTimeToNext,
        highTimeToNext: inputs.highTimeToNext,
      };
    } else if (type === "packages") {
      baseUrl = process.env.NEXT_PUBLIC_API_URL + "/packages/download_csv";
      params = {
        id: inputs.id,
        state: inputs.state,
        startTimeWindow: inputs.startTimeWindow,
        endTimeWindow: inputs.endTimeWindow,
        lowPlannedServiceTime: inputs.lowPlannedServiceTime,
        highPlannedServiceTime: inputs.highPlannedServiceTime,
        minDepth: inputs.minDepth,
        maxDepth: inputs.maxDepth,
        minHeight: inputs.minHeight,
        maxHeight: inputs.maxHeight,
        minWidth: inputs.minWidth,
        maxWidth: inputs.maxWidth,
        routeId: inputs.routeId,
        stopId: inputs.stopId,
      };
    }

    const url = buildUrlWithParams(baseUrl, params);
    const response = await axiosInstance.get(url, {
      responseType: "blob",
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    const name = type + ".csv";
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the CSV file", error);
  }
};
