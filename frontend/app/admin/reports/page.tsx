"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import './reports.css'
import jsPDF from "jspdf";


export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [totalTime, setTotalTime] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get("/admin/reports").then((res) => {
      setReports(res.data);
    });
  }, []);

  const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Attendance Report", 10, 10);

  reports.forEach((r, i) => {
    doc.text(`${r.name} - ${r.date} - ${r.short_report}`, 10, 20 + i * 10);
  });

  doc.save("attendance.pdf");
};



  const viewMore = async (userId: number, date: string) => {

    const detailRes = await API.get(`/admin/report-details/${userId}/${date}`);
    const totalRes = await API.get(`/admin/total-time/${userId}/${date}`);

    setDetails(detailRes.data);
    setTotalTime(totalRes.data);
    setShowModal(true);
  };

  function formatMySQLDate(dateString: string) {
    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };


  return (
    <AuthGuard role="admin">
      <h2>Daily Reports</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Short Report</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r: any, i) => {
            return (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.short_report}</td>
                <td>{formatMySQLDate(r.date)
                }</td>
                <td>
                  <button onClick={() => viewMore(r.user_id, formatMySQLDate(r.date)
                  )}>
                    View More
                  </button>
                  <button onClick={exportPDF}>Export PDF</button>
                </td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>

      {/* MODAL POPUP */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Full Report</h3>

            {details.map((d: any, i: number) => (
              <div key={i}>
                <p><b>Name:</b> {d.name}</p>
                <p><b>Email:</b> {d.email}</p>
                <p><b>Report:</b> {d.report}</p>
                <p>
                  <b>Session:</b> {d.check_in} → {d.check_out}
                  ({d.session_minutes} min)
                </p>
                <hr />
              </div>
            ))}

            <h4>Total Working Time: {totalTime?.total_minutes} minutes</h4>

            <button className="close" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
