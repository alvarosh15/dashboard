import Map from "@/app/components/map/map.js";
import { getLocAndLatFromId } from "@/app/utils/dataFetch.js";

export default async function MapPage() {
  const data = await getLocAndLatFromId("00930ddc-25f9-4371-a437-1e37c9d0a80d");

  return (
    <div>
      <Map data={data} />
    </div>
  );
}
