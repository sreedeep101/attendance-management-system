"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import "./profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    API.get("/employee/profile").then((res) => {
      setProfile(res.data);
    });
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Employee Profile</h2>

        <p><b>Name:</b> {profile.name}</p>
        <p><b>Email:</b> {profile.email}</p>
        <p><b>Role:</b> {profile.role}</p>
      </div>
    </div>
  );
}
