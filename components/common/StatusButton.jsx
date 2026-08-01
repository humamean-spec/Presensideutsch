import React from "react";
import { STATUS_META } from "../../lib/constants";

function StatusButton({ status, onClick }) {
  const m = STATUS_META[status] || STATUS_META.NOT_SET;
  return (
    <button className="pd-status-btn" style={{ background: m.bg, color: m.color }} onClick={onClick} title="Klik untuk ubah status">
      {m.label}
    </button>
  );
}

export default StatusButton;
