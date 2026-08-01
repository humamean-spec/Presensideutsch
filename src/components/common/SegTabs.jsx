import React from "react";

function SegTabs({ tabs, value, onChange }) {
  return (
    <div className="pd-tabs">
      {tabs.map(t => (
        <button key={t.value} className={"pd-tab " + (value === t.value ? "active" : "")} onClick={() => onChange(t.value)}>{t.label}</button>
      ))}
    </div>
  );
}

export default SegTabs;
