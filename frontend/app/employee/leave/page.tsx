"use client";

import { useState } from "react";
import API from "../../lib/api";
import "./leave.css";

export default function LeavePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  const applyLeave = async () => {
    if (!from || !to || !reason) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      await API.post("/employee/leave", { from, to, reason });
      setMsg("Leave applied successfully!");
      setFrom("");
      setTo("");
      setReason("");
    } catch (err) {
      setMsg("Error applying leave");
    }
  };

  return (
    <div className="leave-container">
      <div className="leave-card">
        <h2>Apply for Leave</h2>

        <label>From Date</label>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />

        <label>To Date</label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

        <label>Reason</label>
        <textarea
          placeholder="Reason for leave..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button onClick={applyLeave}>Apply Leave</button>

        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
}
