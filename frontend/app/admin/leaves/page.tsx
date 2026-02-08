"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";

export default function LeaveAdminPage() {
    const [leaves, setLeaves] = useState<any[]>([]);

    const loadLeaves = () => {
        API.get("/admin/leaves").then(res => setLeaves(res.data));
    };

    useEffect(loadLeaves, []);

    const updateStatus = async (id: number, status: string) => {
        await API.put(`/admin/leave/${id}`, { status });
        loadLeaves();
    };

    return (
        <AuthGuard role="admin">
            <h2>Leave Requests</h2>

            <table border={1}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                {leaves.map(l => (
                    <tr key={l.id}>
                        <td>{l.name}</td>
                        <td>{l.from_date}</td>
                        <td>{l.to_date}</td>
                        <td>{l.reason}</td>
                        <td>{l.status}</td>
                        <td>
                            <button onClick={() => updateStatus(l.id, "approved")}>Approve</button>
                            <button onClick={() => updateStatus(l.id, "rejected")}>Reject</button>
                        </td>
                    </tr>
                ))}
            </table>
        </AuthGuard>
    );
}
