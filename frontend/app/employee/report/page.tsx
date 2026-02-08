"use client";

import { useState } from "react";
import API from "../../lib/api";
import "./report.css";

export default function DailyReportPage() {
  const [report, setReport] = useState("");
  const [msg, setMsg] = useState("");

  const submitReport = async () => {
    try {
      await API.post("/employee/report", { report });
      setMsg("Report submitted successfully!");
      setReport("");
    } catch (err) {
      setMsg("Error submitting report");
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h2>Daily Work Report</h2>

        <textarea
          placeholder="Write what you did today..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
        />

        <button onClick={submitReport}>Submit Report</button>

        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
}
