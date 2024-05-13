import Pie from "@/app/components/charts/Pie";
import Bar from "@/app/components/charts/Bar";

export default function Chart({ type, data, title }) {
  console.log(type);
  switch (type) {
    case "pie":
      return <Pie data={data} title={title} />;
    default:
      return <div>{`${type}`}</div>;
  }
}
