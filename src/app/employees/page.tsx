import EmployeeTable from "./components/EmployeeTable";

export default function EmployeesPage() {
  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <span className="eyebrow">Employee Management</span>
          <h1>Employee directory</h1>
          <p>Search, filter, and manage employee records with full CRUD support.</p>
        </div>
      </div>
      <EmployeeTable />
    </section>
  );
}
