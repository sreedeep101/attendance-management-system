"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Employee Panel</h2>

      <Link href="/employee">Dashboard</Link>
      <Link href="/employee/report">Daily Report</Link>
      <Link href="/employee/profile">Profile</Link>
      <Link href="/employee/chart">Attendance Chart</Link>
      <Link href="/employee/report">Daily Report</Link>
      <Link href="/employee/leave">Apply Leave</Link>

    </div>
  );
}
