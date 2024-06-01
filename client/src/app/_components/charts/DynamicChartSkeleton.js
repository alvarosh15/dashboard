import { OneByOne, TwoByOne, ThreeByOne } from "@/app/_components/charts/Boxes";

const sizeMapping = {
  "1x1": OneByOne,
  "2x1": TwoByOne,
  "3x1": ThreeByOne,
};

const numberOfBarsMapping = {
  "1x1": 8,
  "2x1": 12,
  "3x1": 18,
};

function getRandomHeight(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function DynamicChartSkeleton({ size, type }) {
  const SizeComponent = sizeMapping[size];
  const numberOfBars = numberOfBarsMapping[size];
  return (
    <SizeComponent>
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-100 rounded-md">
        <div className="animate-pulse h-8 bg-gray-300 rounded w-5/6 m-4"></div>
        {type === "pie" ? (
          <div
            style={{ height: "150px", width: "150px" }}
            className="animate-pulse flex items-center justify-center w-1/2 h-1/2 bg-gray-300 rounded-full"
          ></div>
        ) : type === "bar" ? (
          <div className="animate-pulse w-full h-full flex items-end justify-around space-x-2 p-4">
            {[...Array(numberOfBars)].map((_, i) => (
              <div
                key={i}
                className="w-12 bg-gray-300 rounded"
                style={{ height: `${getRandomHeight(20, 80)}%` }}
              ></div>
            ))}
          </div>
        ) : type === "lines" ? (
          <svg
            width="80%"
            height="80%"
            viewBox="0 0 100 100"
            className="bg-gray-100"
          >
            <polyline
              points="10,90 30,40 50,20 70,60 90,10"
              className="stroke-current text-gray-300"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <div className="animate-pulse h-6 bg-gray-300 rounded w-3/6"></div>
        )}
      </div>
    </SizeComponent>
  );
}
