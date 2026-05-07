import clientPromise from "@/lib/mongodb";

async function fetchDepartments() {
  const client = await clientPromise;
  const db = client.db();
  return db
    .collection("employees")
    .aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray();
}

export default async function DepartmentsPage() {
  const departments = await fetchDepartments();

  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <span className="eyebrow">Departments</span>
          <h1>Team organization</h1>
          <p>Review all departments and how many employees belong to each group.</p>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {departments.map((department: any) => (
          <div className="stat-card" key={department._id}>
            <h3>{department._id || "Unassigned"}</h3>
            <p>{department.count} employee{department.count === 1 ? "" : "s"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
