import React from "react";

function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="pd-empty">
      {icon}
      <div className="pd-empty-title">{title}</div>
      {sub ? <div style={{ fontSize: 12.5 }}>{sub}</div> : null}
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}

export default EmptyState;
