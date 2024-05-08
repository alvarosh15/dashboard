export default function IntervalInput({
  inputs,
  start,
  end,
  handleChange,
  type,
}) {
  return (
    <>
      <div
        className={`p-2 flex justify-center items-center gap-2 rounded-md ${
          inputs[start]
            ? "bg-sky-100 text-sky-800"
            : "bg-slate-50 text-slate-400"
        }
    outline-none`}
      >
        Desde
        <input
          type={type}
          className={`${
            inputs[start]
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
    outline-none`}
          value={inputs[start]}
          name={start}
          onChange={handleChange}
        />
      </div>
      <div
        className={`p-2 flex justify-center items-center gap-2 rounded-md ${
          inputs[end] ? "bg-sky-100 text-sky-800" : "bg-slate-50 text-slate-400"
        }
    outline-none`}
      >
        Hasta
        <input
          type={type}
          className={`${
            inputs[end]
              ? "bg-sky-100 text-sky-800"
              : "bg-slate-50 text-slate-400"
          }
    outline-none`}
          value={inputs[end]}
          name={end}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
