import React from "react";
import { STATUS_META } from "../../lib/constants";

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.NOT_SET;
  return (
    <span className="pd-badge" style={{ background: m.bg, color: m.color }}>
      <span className="pd-dot" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export default StatusBadge;
