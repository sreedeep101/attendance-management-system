"use client";

import AuthGuard from "../components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard role="admin">
      <h1>Admin Dashboard</h1>
    </AuthGuard>
  );
}
