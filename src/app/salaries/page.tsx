import clientPromise from "@/lib/mongodb";

async function fetchSalaryStats() {
  const client = await clientPromise;
  const db = client.db();

  const records = await db
    .collection("employees")
    .find({}, { projection: { firstName: 1, lastName: 1, department: 1, role: 1, salary: 1 } })
    .toArray();

  const stats = await db
    .collection("employees")
    .aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$salary" },
          average: { $avg: "$salary" },
          highest: { $max: "$salary" },
          lowest: { $min: "$salary" },
        },
      },
    ])
    .toArray();

  return { records, summary: stats[0] || { total: 0, average: 0, highest: 0, lowest: 0 } };
}

export default async function SalariesPage() {
  const { records, summary } = await fetchSalaryStats();

  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <span className="eyebrow">Payroll</span>
          <h1>Salary analytics</h1>
          <p>Keep payroll transparent with totals, averages, and the highest and lowest salaries.</p>
        </div>
      </div>

      <div className="grid stats-grid">
        <div className="stat-card">
          <h3>Payroll total</h3>
          <p>${summary.total.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Average salary</h3>
          <p>${Math.round(summary.average).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Highest salary</h3>
          <p>${summary.highest.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Lowest salary</h3>
          <p>${summary.lowest.toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <h2>Salary records</h2>
        <div className="table-scroll" style={{ marginTop: "1rem" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: any) => (
                <tr key={record._id.toString()}>
                  <td>{record.firstName} {record.lastName}</td>
                  <td>{record.department}</td>
                  <td>{record.role}</td>
                  <td>${Number(record.salary).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
