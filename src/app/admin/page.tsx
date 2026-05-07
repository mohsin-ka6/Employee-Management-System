"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setMessage(result.message || "Login successful.");

      if (response.ok) {
        window.localStorage.setItem("ems_token", result.token);
        router.push("/dashboard");
      }
    } catch (error) {
      setMessage("Network error during login.");
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage employees, departments, payroll and admin settings.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button className="button button-primary" type="submit">Sign in</button>
        </form>
        {message ? <p className="alert alert-info">{message}</p> : null}
        <p className="auth-note">Use admin@example.com / Admin@123 after seeding the admin account.</p>
      </div>
    </section>
  );
}
