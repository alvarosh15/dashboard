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
    </div>
  );
}
