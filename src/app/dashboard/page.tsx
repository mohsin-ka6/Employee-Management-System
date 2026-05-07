import clientPromise from "@/lib/mongodb";

async function fetchStats() {
  const client = await clientPromise;
  const db = client.db();
  const employeeCount = await db.collection("employees").countDocuments();
  const departments = await db.collection("employees").distinct("department");
  const salaryData = await db.collection("employees").aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$salary" },
        average: { $avg: "$salary" },
        max: { $max: "$salary" },
      },
    },
  ]).toArray();
  const activeCount = await db.collection("employees").countDocuments({ status: "active" });

  return {
    employeeCount,
    departmentCount: departments.length,
    totalSalary: salaryData[0]?.total ?? 0,
    averageSalary: salaryData[0]?.average ?? 0,
    maxSalary: salaryData[0]?.max ?? 0,
    activeCount,
  };
}

export default async function DashboardPage() {
  const stats = await fetchStats();

  return (
    <section className="dashboard-page">
      <div className="hero-card">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Team and payroll insights</h1>
          <p>Monitor employees, department coverage, payroll totals, and active employee performance from one screen.</p>
        </div>
      </div>
      <div className="grid stats-grid">
        <div className="stat-card">
          <h3>Total employees</h3>
          <p>{stats.employeeCount}</p>
        </div>
        <div className="stat-card">
          <h3>Departments</h3>
          <p>{stats.departmentCount}</p>
        </div>
        <div className="stat-card">
          <h3>Active employees</h3>
          <p>{stats.activeCount}</p>
        </div>
        <div className="stat-card">
          <h3>Payroll total</h3>
          <p>${stats.totalSalary.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Average salary</h3>
          <p>${Math.round(stats.averageSalary).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Highest salary</h3>
          <p>${stats.maxSalary.toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
}
