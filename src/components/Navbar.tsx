"use client";

import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employees", label: "Employees" },
  { href: "/departments", label: "Departments" },
  { href: "/salaries", label: "Salaries" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-branding">
        <Link href="/" className="logo">
          EMS
        </Link>
        <p className="brand-tag">Employee Management System</p>
      </div>
      <nav className="site-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="nav-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
