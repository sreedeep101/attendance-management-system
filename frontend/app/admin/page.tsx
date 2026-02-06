"use client";

import EmployeeTable from "./components/EmployeeTable";

export default function AdminPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <EmployeeTable />
    </div>
  );
}
