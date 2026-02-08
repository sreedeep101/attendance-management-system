"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children, role }: any) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
      router.push("/");
    }

    if (role && userRole !== role) {
      router.push("/");
    }
  }, []);

  return children;
}
