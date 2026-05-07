"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function EmployeeEditor({ employeeId }: { employeeId: string }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    void loadEmployee();
  }, [employeeId]);

  async function loadEmployee() {
    setLoading(true);
    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      const result = await response.json();
      if (result.success) {
        setEmployee(result.employee);
      } else {
        setMessage(result.message || "Employee not found.");
      }
    } catch (err) {
      setMessage("Unable to load employee details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!employee) return;
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Employee updated successfully.");
        await loadEmployee();
        setActiveTab("details");
      } else {
        setMessage(result.message || "Unable to update employee.");
      }
    } catch (err) {
      setMessage("Failed to save employee.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    if (!employee) return;
    setSaving(true);
    setMessage("");

    try {
      const updatedStatus = employee.status === "active" ? "inactive" : "active";
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...employee, status: updatedStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setEmployee({ ...employee, status: updatedStatus });
        setMessage(`Status updated to ${updatedStatus}.`);
      } else {
        setMessage(result.message || "Unable to update status.");
      }
    } catch (err) {
      setMessage("Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  async function copyEmail() {
    if (!employee) return;
    try {
      await navigator.clipboard.writeText(employee.email);
      setMessage("Email copied to clipboard.");
    } catch {
      setMessage("Unable to copy email.");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this employee permanently?")) return;
    try {
      const response = await fetch(`/api/employees/${employeeId}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        router.push("/employees");
      } else {
        setMessage(result.message || "Unable to delete employee.");
      }
    } catch (err) {
      setMessage("Delete request failed.");
    }
  }

  if (loading) {
    return <p>Loading employee details...</p>;
  }

  if (!employee) {
    return <p>{message || "Employee not found."}</p>;
  }

  return (
    <div className="employee-detail-shell">
      <div className="detail-grid">
        <div className="summary-panel card">
          <div className="profile-preview">
            <span className="profile-badge">{employee.firstName.charAt(0)}{employee.lastName.charAt(0)}</span>
            <div>
              <h2>{employee.firstName} {employee.lastName}</h2>
              <p className="muted">{employee.role} in {employee.department}</p>
            </div>
          </div>

          <div className="summary-values">
            <div>
              <span>Status</span>
              <strong>{employee.status}</strong>
            </div>
            <div>
              <span>Salary</span>
              <strong>${employee.salary.toLocaleString()}</strong>
            </div>
            <div>
              <span>Hire date</span>
              <strong>{formatDate(employee.hireDate)}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{employee.email}</strong>
            </div>
          </div>

          <div className="action-group">
            <button className="button button-secondary" type="button" onClick={toggleStatus} disabled={saving}>
              Mark {employee.status === "active" ? "inactive" : "active"}
            </button>
            <button className="button button-secondary" type="button" onClick={copyEmail}>
              Copy email
            </button>
            <button className="button button-danger" type="button" onClick={handleDelete}>
              Delete employee
            </button>
          </div>
        </div>

        <div className="editor-panel card">
          <div className="tab-list">
            <button type="button" className={`tab-item ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>Details</button>
            <button type="button" className={`tab-item ${activeTab === "edit" ? "active" : ""}`} onClick={() => setActiveTab("edit")}>Edit</button>
          </div>

          {activeTab === "details" ? (
            <div className="info-grid">
              <div>
                <h3>Employee profile</h3>
                <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
                <p><strong>Department:</strong> {employee.department}</p>
                <p><strong>Role:</strong> {employee.role}</p>
              </div>
              <div>
                <h3>Work info</h3>
                <p><strong>Status:</strong> {employee.status}</p>
                <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
                <p><strong>Hired:</strong> {formatDate(employee.hireDate)}</p>
              </div>
              <div>
                <h3>Contact</h3>
                <p><strong>Email:</strong> {employee.email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="form-grid">
              <div className="form-grid">
                <label>
                  First name
                  <input className="input" value={employee.firstName} onChange={(event) => setEmployee({ ...employee, firstName: event.target.value })} required />
                </label>
                <label>
                  Last name
                  <input className="input" value={employee.lastName} onChange={(event) => setEmployee({ ...employee, lastName: event.target.value })} required />
                </label>
              </div>
              <label>
                Email
                <input className="input" type="email" value={employee.email} onChange={(event) => setEmployee({ ...employee, email: event.target.value })} required />
              </label>
              <div className="form-grid">
                <label>
                  Department
                  <input className="input" value={employee.department} onChange={(event) => setEmployee({ ...employee, department: event.target.value })} required />
                </label>
                <label>
                  Role
                  <input className="input" value={employee.role} onChange={(event) => setEmployee({ ...employee, role: event.target.value })} required />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  Salary
                  <input className="input" type="number" value={employee.salary} onChange={(event) => setEmployee({ ...employee, salary: Number(event.target.value) })} required />
                </label>
                <label>
                  Hire date
                  <input className="input" type="date" value={employee.hireDate.slice(0, 10)} onChange={(event) => setEmployee({ ...employee, hireDate: event.target.value })} />
                </label>
              </div>
              <label>
                Status
                <select className="select" value={employee.status} onChange={(event) => setEmployee({ ...employee, status: event.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <div className="button-row">
                <button className="button button-primary" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {message ? <p className="alert alert-info">{message}</p> : null}
    </div>
  );
}
