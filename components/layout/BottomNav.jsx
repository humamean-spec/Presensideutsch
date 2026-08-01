import React from "react";
import { NAV_ITEMS, BOTTOM_NAV_KEYS } from "../../lib/constants";

function BottomNav({ view, setView }) {
  return (
    <nav className="pd-bottom-nav no-print">
      {BOTTOM_NAV_KEYS.map(key => {
        const item = NAV_ITEMS.find(n => n.key === key);
        const Icon = item.icon;
        return (
          <button key={key} className={"pd-bottom-nav-item " + (view === key ? "active" : "")} onClick={() => setView(key)}>
            <Icon size={19} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
