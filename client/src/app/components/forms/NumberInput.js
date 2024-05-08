export default function NumberInput({ inputs, field, placeHolder, handleChange }) {
  return (
    <input
      type="number"
      className={`w-36 p-2 rounded-md ${
        inputs[field] ? "bg-sky-100 text-sky-800" : "bg-slate-50 text-slate-400"
      } outline-none`}
      value={inputs[field]}
      placeholder={placeHolder}
      name={field}
      onChange={handleChange}
    />
  );
}
