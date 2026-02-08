"use client";
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/employees">Employees</Link>
      <Link href="/admin/reports">Reports</Link>
      <Link href="/admin/leaves">Leave Approval</Link>
    </div>
  );
}
