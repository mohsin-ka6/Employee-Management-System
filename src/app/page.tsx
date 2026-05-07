import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Admin System</span>
        <h1>Employee Management Made Simple</h1>
        <p>Manage employees, departments, payroll, and admin roles with a responsive dashboard built on Next.js and MongoDB.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/dashboard">View Dashboard</Link>
          <Link className="button button-secondary" href="/admin">Admin Login</Link>
        </div>
      </div>

      <div className="hero-cards">
        <div className="feature-card">
          <h3>Employee CRUD</h3>
          <p>Create, update, view, and delete employee records with fast filtering.</p>
        </div>
        <div className="feature-card">
          <h3>Department Overview</h3>
          <p>View department counts and stay on top of team distribution.</p>
        </div>
        <div className="feature-card">
          <h3>Payroll Insights</h3>
          <p>Check salary totals, averages, and top earners in a single view.</p>
        </div>
      </div>
    </section>
  );
}
