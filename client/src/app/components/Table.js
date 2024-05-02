export default function Table({ headers, currentItems, keys }) {
  return (
    <table className="text-sky-800 text-xs table-auto table-responsive w-full mt-2">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th className="border border-sky-800 bg-sky-100" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentItems.length > 0 &&
          currentItems.map((route, index) => (
            <tr key={index}>
              {keys.map((key, index) => (
                <td key={index}>{route[key]}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
