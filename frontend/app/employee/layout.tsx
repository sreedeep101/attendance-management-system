"use client";

import "./employee.css";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import AuthGuard from "../components/AuthGuard";

export default function EmployeeLayout({ children }: any) {
  return (
    <AuthGuard role="employee">
      <div className="emp-container">
        <Sidebar />
        <div className="emp-main">
          <Topbar />
          <div className="emp-content">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
