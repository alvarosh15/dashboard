export default function TableSkeleton({ headers, rowCount }) {
  return (
    <div className="rounded-md bg-transparent md:bg-white md:shadow-sm p-3 ">
      <table className=" hidden md:table table-auto w-full mb-2">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>
                <div className="animate-pulse text-transparent bg-slate-300 h-8 rounded-md">
                  {header}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rowCount)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((_, cellIndex) => (
                <td key={cellIndex} className="p-4">
                  <div className="animate-pulse bg-slate-200 h-8 min-w-6 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
