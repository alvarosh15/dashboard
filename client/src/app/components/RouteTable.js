export default function RouteTable({ routes, scores }) {
  return (
    <div className="rounded-md bg-white shadow-md">
      <h2>Resultados de Búsqueda</h2>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Station Code</th>
            <th>Date</th>
            <th>Hora de salida</th>
            <th>Capacidad</th>
            <th>Score Id</th>
          </tr>
        </thead>
        <tbody>
          {routes.length > 0 &&
            routes.map((route, index) => (
              <tr key={index}>
                <td>{route.RouteId}</td>
                <td>{route.StationCode}</td>
                <td>{route.Date}</td>
                <td>{route.DepartureTime}</td>
                <td>{route.ExecutorCapacity}</td>
                <td>{scores[route.ScoreId] ? scores[route.ScoreId] : "-"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
