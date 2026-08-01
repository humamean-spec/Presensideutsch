import React from "react";
import { NAV_ITEMS } from "../../lib/constants";
import { LOGO_DATA_URI } from "../../data/logo";
import { initials } from "../../lib/idUtils";

function Sidebar({ view, setView, mobileOpen, setMobileOpen, settings }) {
  return (
    <>
      {mobileOpen && <div className="pd-sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={"pd-sidebar " + (mobileOpen ? "open" : "")}>
        <div className="pd-sidebar-head">
          <div className="pd-brand">
            <img src={LOGO_DATA_URI} alt="Logo SMA N 1 Sewon" />
            <div>
              <div className="pd-brand-name pd-display">PRESENSI DEUTSCH</div>
              <div className="pd-brand-sub">German Teacher Dashboard</div>
            </div>
          </div>
          <div className="pd-triband" />
        </div>
        <nav className="pd-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} className={"pd-nav-item " + (view === item.key ? "active" : "")}
                onClick={() => { setView(item.key); setMobileOpen(false); }}>
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="pd-sidebar-foot">
          <div className="pd-teacher-chip">
            <div className="pd-avatar">{initials(settings.teacherName || "GT")}</div>
            <div>
              <div className="pd-teacher-chip-name">{settings.teacherName}</div>
              <div className="pd-teacher-chip-role">Guru Bahasa Jerman</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
