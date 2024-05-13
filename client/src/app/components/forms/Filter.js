export default function Filter({ text, field, setInputs }) {
  const removeFilter = (text, field) => {
    setInputs((prevInputs) => {
      const updatedValues = new Set(prevInputs[field]);
      updatedValues.delete(text);

      return {
        ...prevInputs,
        [field]: Array.from(updatedValues),
      };
    });
  };
  return (
    <div
      onClick={() => {
        removeFilter(text, field);
      }}
      className="hover:bg-red-100 hover:text-red-800 flex flex-row w-fit group justify-center items-center bg-sky-100 text-sky-800 rounded-md p-2"
    >
      {text}
      {/*<span
        onClick={() => {
          removeFilter(text, field);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-x hidden group-hover:block"
          viewBox="0 0 16 16"
        >
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
        </svg>
      </span>*/}
    </div>
  );
}
