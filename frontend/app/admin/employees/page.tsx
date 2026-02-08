"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get("/admin/employees").then((res) => {
      setEmployees(res.data);
    });
  }, []);

  return (
    <AuthGuard role="admin">
      <h2>Employees</h2>

      <table border={1} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp: any) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AuthGuard>
  );
}
