"use client";

import './module.css';
import { useState } from "react";
import API from "./lib/api"
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      // save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // redirect based on role
      if (res.data.role === "admin") router.push("/admin");
      else router.push("/employee");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleLogin} style={{ borderRadius: 10,  gap: 8, padding: 20, justifyContent: "center", width: 350,display: "flex" , flexDirection: "column", alignItems: "center" }} >
        <h2 style={{ color: "white" , fontSize: 27, fontWeight: "bold" }}>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button type="submit" className="sub-button">
          Login
        </button>
      </form>
    </div>
  );
}
