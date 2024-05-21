import { removeLikeChart, addLikeChart } from "@/app/utils/statistics";

export default function Bookmark({
  chartId,
  city,
  likedChartsIds,
  updatedItem,
  setUpdatedItem,
}) {
  const addLike = async (chartId, city) => {
    try {
      await addLikeChart(chartId, city);
      setUpdatedItem(!updatedItem);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeLike = async (chartId) => {
    try {
      await removeLikeChart(chartId);
      setUpdatedItem(!updatedItem);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div>
      {likedChartsIds.includes(chartId) ? (
        <span
          onClick={() => removeLike(chartId)}
          className="absolute cursor-pointer hidden text-sky-800 bg-sky-100 rounded-md p-1 z-50 m-1 group-hover:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-bookmark-star-fill"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"
            />
          </svg>
        </span>
      ) : (
        <span
          onClick={() => addLike(chartId, city)}
          className="absolute cursor-pointer hidden text-sky-800 bg-sky-100 rounded-md p-1 z-50 m-1 group-hover:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-bookmark-star"
            viewBox="0 0 16 16"
          >
            <path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.18.18 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.18.18 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.18.18 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.18.18 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.18.18 0 0 0 .134-.098z" />
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
          </svg>
        </span>
      )}
    </div>
  );
}
