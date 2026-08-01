import React, { useState } from "react";
import { FileSpreadsheet, Printer, ClipboardList, TrendingUp, CheckCircle2, AlertTriangle, FileText, BookOpen } from "lucide-react";
import { StatCard, EmptyState } from "../../components/common";
import { formatShortDate, isoWeekRange, todayISO, sessionKey } from "../../lib/dateUtils";
import { sessionsInRange, summarizeRecords, classById } from "../../lib/aggregations";
import { exportRowsToExcel, printReport } from "./exporters";

function WeeklyReport({ db }) {
  const [classId, setClassId] = useState(db.classes[0] && db.classes[0].id);
  const [anchor, setAnchor] = useState(todayISO());
  const [start, end] = isoWeekRange(anchor);
  const activeClasses = db.classes.filter(c => !c.archived);
  const sessions = sessionsInRange(db, start, end, classId);

  let totals = { PRESENT:0, EXCUSED:0, SICK:0, ABSENT:0, DUTY:0, total:0 };
  sessions.forEach(s => { const sum = summarizeRecords(s.records); ["PRESENT","EXCUSED","SICK","ABSENT","DUTY"].forEach(k => totals[k]+=sum[k]); totals.total += (sum.total - sum.NOT_SET); });
  const rate = totals.total > 0 ? Math.round((totals.PRESENT / totals.total) * 1000) / 10 : null;

  function doExport() {
    const rows = [["Tanggal","Pertemuan","Hadir","Izin","Sakit","Alpa","Tugas Sekolah","Topik"]];
    sessions.forEach(s => {
      const sum = summarizeRecords(s.records);
      const j = db.journal[sessionKey(s.classId, s.date)];
      rows.push([formatShortDate(s.date), s.meetingNumber, sum.PRESENT, sum.EXCUSED, sum.SICK, sum.ABSENT, sum.DUTY, j?j.topic:"-"]);
    });
    exportRowsToExcel([{ name: "Laporan Mingguan", rows }], "Laporan-Mingguan-" + classById(db,classId)?.name + "-" + start + ".xlsx");
  }

  return (
    <div>
      <div className="pd-flex-between no-print" style={{ marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="pd-field" style={{ marginBottom: 0 }}>
            <label>Kelas</label>
            <select className="pd-select" value={classId} onChange={e => setClassId(e.target.value)}>
              {activeClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="pd-field" style={{ marginBottom: 0 }}>
            <label>Minggu (pilih tanggal)</label>
            <input type="date" className="pd-input" value={anchor} onChange={e => setAnchor(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pd-btn pd-btn-ghost" onClick={doExport}><FileSpreadsheet size={15} /> Excel</button>
          <button className="pd-btn pd-btn-ghost" onClick={printReport}><Printer size={15} /> Cetak / PDF</button>
        </div>
      </div>

      <div className="pd-section-title">Minggu {formatShortDate(start)} — {formatShortDate(end)}</div>
      <div className="pd-stat-grid">
        <StatCard icon={<ClipboardList size={17} />} label="Total Pertemuan" value={sessions.length} tint="#0F2A47" />
        <StatCard icon={<TrendingUp size={17} />} label="Tingkat Kehadiran" value={rate!==null?rate+"%":"—"} tint="#16A34A" />
        <StatCard icon={<CheckCircle2 size={17} />} label="Total Hadir" value={totals.PRESENT} tint="#16A34A" />
        <StatCard icon={<AlertTriangle size={17} />} label="Total Alpa" value={totals.ABSENT} tint="#DC2626" />
      </div>

      <div className="pd-grid-2">
        <div className="pd-card pd-card-pad">
          <div className="pd-section-title">Rekap Kehadiran</div>
          {sessions.length === 0 ? <EmptyState icon={<FileText size={36} />} title="Belum ada sesi minggu ini" /> :
            <div className="pd-table-wrap"><table className="pd-table">
              <thead><tr><th>Tanggal</th><th>Pertemuan</th><th>H</th><th>I</th><th>S</th><th>A</th><th>T</th></tr></thead>
              <tbody>{sessions.map(s => { const sum = summarizeRecords(s.records); return (
                <tr key={s.id}><td>{formatShortDate(s.date)}</td><td>{s.meetingNumber}</td>
                  <td>{sum.PRESENT}</td><td>{sum.EXCUSED}</td><td>{sum.SICK}</td><td>{sum.ABSENT}</td><td>{sum.DUTY}</td></tr>
              );})}</tbody>
            </table></div>
          }
        </div>
        <div className="pd-card pd-card-pad">
          <div className="pd-section-title"><BookOpen size={16} color="var(--navy)" /> Timeline Topik</div>
          {sessions.length === 0 ? <div style={{ fontSize: 13, color: "var(--muted)" }}>Belum ada topik tercatat.</div> :
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions.map(s => {
                const j = db.journal[sessionKey(s.classId, s.date)];
                return (
                  <div key={s.id} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>Pertemuan {s.meetingNumber}</div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{j ? j.topic : "(Jurnal belum diisi)"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default WeeklyReport;
