import React from "react";

function StatCard({ icon, label, value, tint, sub }) {
  return (
    <div className="pd-stat-card">
      <div className="pd-stat-icon" style={{ background: tint + "22", color: tint }}>{icon}</div>
      <div className="pd-stat-value">{value}</div>
      <div className="pd-stat-label">{label}</div>
      {sub ? <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
}

export default StatCard;
