"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", department: "", role: "", salary: "", hireDate: "", status: "active" });
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Employee created successfully.");
        router.push("/employees");
      } else {
        setMessage(result.message || "Failed to create employee.");
      }
    } catch (error) {
      setMessage("Unable to create employee.");
    }
  }

  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <span className="eyebrow">Create record</span>
          <h1>Add new employee</h1>
          <p>Fill in the new employee details to add them to the roster.</p>
        </div>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            First name
            <input className="input" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} required />
          </label>
          <label>
            Last name
            <input className="input" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} required />
          </label>
          <label>
            Email
            <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            Department
            <input className="input" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required />
          </label>
          <label>
            Role
            <input className="input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} required />
          </label>
          <label>
            Salary
            <input className="input" type="number" value={form.salary} onChange={(event) => setForm({ ...form, salary: event.target.value })} required />
          </label>
          <label>
            Hire date
            <input className="input" type="date" value={form.hireDate} onChange={(event) => setForm({ ...form, hireDate: event.target.value })} />
          </label>
          <label>
            Status
            <select className="select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <button className="button button-primary" type="submit">Create employee</button>
        </form>
        {message ? <p className="alert alert-info">{message}</p> : null}
      </div>
    </section>
  );
}
