"use client";

import "./admin.css";
import AdminSidebar from "./sidebar";
import Topbar from "./topbar";
import AuthGuard from "../components/AuthGuard";

export default function AdminLayout({ children }: any) {
  return (
    <AuthGuard role="admin">
      <div className="emp-container">
        <AdminSidebar />
        <div className="emp-main">
          <Topbar />
          <div className="emp-content">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
