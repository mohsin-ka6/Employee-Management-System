import EmployeeEditor from "../components/EmployeeEditor";

export default function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <span className="eyebrow">Employee details</span>
          <h1>View and manage employee</h1>
          <p>Edit profile, salary, department, and status directly from this page.</p>
        </div>
      </div>
      <EmployeeEditor employeeId={params.id} />
    </section>
  );
}
