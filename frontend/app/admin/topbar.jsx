"use client";

import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="topbar">
      <span>admin</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
