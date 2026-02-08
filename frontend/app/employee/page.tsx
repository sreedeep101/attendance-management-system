"use client";

import { useEffect, useState } from "react";
import API from "../lib/api";
import AuthGuard from "../components/AuthGuard";

export default function EmployeeDashboard() {

  const [status, setStatus] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    API.get("/employee/status").then(res => setStatus(res.data.checkedIn));
    API.get("/employee/today-work").then(res => setTotal(res.data.total_minutes || 0));
  }, []);

  const checkIn = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      await API.post("/employee/checkin", { lat: latitude, lng: longitude });
      setStatus(true);
    });
  };

  const checkOut = async () => {
    await API.post("/employee/checkout");
    setStatus(false);
  };

  return (
    <AuthGuard role="employee">
      <div>
      <h2>Today Work Time: {total} minutes</h2>

      {!status ? (
        <button onClick={checkIn}>Check In</button>
      ) : (
        <button onClick={checkOut}>Check Out</button>
      )}
    </div>
    </AuthGuard>
  );
}
