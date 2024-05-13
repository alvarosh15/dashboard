import { OneByOne, TwoByOne, ThreeByOne } from "@/app/components/charts/Boxes";
import Pie from "@/app/components/charts/Pie";
import Bar from "@/app/components/charts/Bar";
import Bookmark from "./Bookmark";

const sizeMapping = {
  "1x1": OneByOne,
  "2x1": TwoByOne,
  "3x1": ThreeByOne,
};

const typeMapping = {
  pie: Pie,
  bar: Bar,
};

export default async function DynamicChart({ config }) {
  const data = await config.dataFetcher(config.city);

  const size = config.size;
  const SizeComponent = sizeMapping[size];

  const type = config.type;
  const Chart = typeMapping[type];

  const title = config.title;

  return (
    <SizeComponent>
      <Bookmark />
      <Chart type={type} data={data} title={title} />
    </SizeComponent>
  );
}
