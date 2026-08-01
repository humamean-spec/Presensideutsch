import React from "react";
import { Menu, Zap } from "lucide-react";
import { NAV_ITEMS } from "../../lib/constants";
import { formatLongDate, todayISO } from "../../lib/dateUtils";

function TopBar({ view, setMobileOpen, onQuickAttendance }) {
  const item = NAV_ITEMS.find(n => n.key === view);
  return (
    <header className="pd-topbar no-print">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="pd-menu-btn" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
        <div>
          <div className="pd-topbar-title pd-display">{item ? item.label : ""}</div>
          <div className="pd-topbar-date">{formatLongDate(todayISO())}</div>
        </div>
      </div>
      <button className="pd-btn pd-btn-accent" onClick={onQuickAttendance}>
        <Zap size={15} /> Presensi Cepat
      </button>
    </header>
  );
}

export default TopBar;
