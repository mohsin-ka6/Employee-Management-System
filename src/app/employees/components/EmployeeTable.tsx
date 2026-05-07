"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  status: string;
  hireDate: string;
};

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchDepartments();
  }, []);

  useEffect(() => {
    void fetchEmployees();
  }, [search, department, status, page]);

  async function fetchDepartments() {
    try {
      const response = await fetch("/api/departments");
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (err) {
      setError("Unable to load departments.");
    }
  }

  async function fetchEmployees() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (search) params.set("search", search);
      if (department) params.set("department", department);
      if (status) params.set("status", status);

      const response = await fetch(`/api/employees?${params.toString()}`);
      const data = await response.json();
      setEmployees(data.employees || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="card card-split">
        <div>
          <h2>Employee directory</h2>
          <p>Search, filter and preview employee records with pagination.</p>
        </div>
        <Link className="button button-primary" href="/employees/new">
          Add Employee
        </Link>
      </div>

      <div className="card">
        <div className="filter-grid">
          <label>
            Search
            <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" />
          </label>
          <label>
            Department
            <select className="select" value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option value="">All departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="alert alert-error">{error}</p> : null}

      <div className="card">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="table-center">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-center">
                    No matching employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.firstName} {employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>${employee.salary.toLocaleString()}</td>
                    <td>{employee.status}</td>
                    <td>
                      <Link className="button button-secondary" href={`/employees/${employee._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="button button-secondary" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <button className="button button-secondary" disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
