"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/admin/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setEmployees(res.data);
  };

  const shortReport = (text: string) => {
    if (!text) return "";
    return text.split(" ").slice(0, 5).join(" ") + "...";
  };

  return (
    <table border={1} width="100%" cellPadding={10}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Report</th>
          <th>Working Time</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{shortReport(emp.report)}</td>
            <td>{emp.totalWorkingTime} hrs</td>
            <td>
              <button onClick={() => alert(emp.report)}>View More</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
