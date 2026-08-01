import React from "react";

function MiniBar({ pct, color }) {
  return (
    <div className="pd-progress-track" style={{ width: 70 }}>
      <div className="pd-progress-fill" style={{ width: Math.max(0, Math.min(100, pct)) + "%", background: color || "var(--red)" }} />
    </div>
  );
}

export default MiniBar;
