import React, { useState } from "react";
import { SegTabs } from "../../components/common";
import DailyReport from "./DailyReport";
import WeeklyReport from "./WeeklyReport";
import MonthlyReport from "./MonthlyReport";

function ReportsView({ db }) {
  const [tab, setTab] = useState("daily");
  return (
    <div>
      <div className="no-print" style={{ marginBottom: 18 }}>
        <SegTabs tabs={[{label:"Harian",value:"daily"},{label:"Mingguan",value:"weekly"},{label:"Bulanan",value:"monthly"}]} value={tab} onChange={setTab} />
      </div>
      {tab === "daily" && <DailyReport db={db} />}
      {tab === "weekly" && <WeeklyReport db={db} />}
      {tab === "monthly" && <MonthlyReport db={db} />}
    </div>
  );
}

/* ============================================================
   Settings — profile, theme, backup
   ============================================================ */

export default ReportsView;
