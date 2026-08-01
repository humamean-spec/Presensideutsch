import React, { useState } from "react";
import { FileSpreadsheet, Printer, FileText, BookOpen } from "lucide-react";
import { EmptyState, StatusBadge } from "../../components/common";
import { todayISO, formatLongDate, sessionKey } from "../../lib/dateUtils";
import { sessionsOnDate, classById, studentById, summarizeRecords, attendanceRate } from "../../lib/aggregations";
import { exportRowsToExcel, printReport } from "./exporters";

function DailyReport({ db }) {
  const [date, setDate] = useState(todayISO());
  const sessions = sessionsOnDate(db, date);

  function doExport() {
    const rows = [["Kelas","Pertemuan","Hadir","Izin","Sakit","Alpa","Tugas Sekolah","Kehadiran %","Topik"]];
    sessions.forEach(s => {
      const cls = classById(db, s.classId);
      const sum = summarizeRecords(s.records);
      const rate = attendanceRate(sum);
      const j = db.journal[sessionKey(s.classId, s.date)];
      rows.push([cls?cls.name:s.classId, s.meetingNumber, sum.PRESENT, sum.EXCUSED, sum.SICK, sum.ABSENT, sum.DUTY, rate!==null?rate+"%":"-", j?j.topic:"-"]);
    });
    exportRowsToExcel([{ name: "Laporan Harian", rows }], "Laporan-Harian-" + date + ".xlsx");
  }

  return (
    <div>
      <div className="pd-flex-between no-print" style={{ marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div className="pd-field" style={{ marginBottom: 0 }}>
          <label>Pilih Tanggal</label>
          <input type="date" className="pd-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pd-btn pd-btn-ghost" onClick={doExport}><FileSpreadsheet size={15} /> Excel</button>
          <button className="pd-btn pd-btn-ghost" onClick={printReport}><Printer size={15} /> Cetak / PDF</button>
        </div>
      </div>

      <div className="pd-card pd-card-pad">
        <div className="pd-section-title">Laporan Harian — {formatLongDate(date)}</div>
        {sessions.length === 0 ? (
          <EmptyState icon={<FileText size={40} />} title="Tidak ada sesi mengajar pada tanggal ini" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {sessions.map(s => {
              const cls = classById(db, s.classId);
              const sum = summarizeRecords(s.records);
              const rate = attendanceRate(sum);
              const j = db.journal[sessionKey(s.classId, s.date)];
              const absentees = Object.entries(s.records).filter(([,r]) => r.status && r.status !== "PRESENT" && r.status !== "NOT_SET");
              return (
                <div key={s.id} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
                  <div className="pd-flex-between" style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{cls ? cls.name : s.classId} <span className="pd-pill" style={{ marginLeft: 8 }}>Pertemuan {s.meetingNumber}</span></div>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>{rate !== null ? rate + "%" : "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    {["PRESENT","EXCUSED","SICK","ABSENT","DUTY"].map(st => <StatusBadge key={st} status={st} />).map((b,i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>{b} <strong>{sum[["PRESENT","EXCUSED","SICK","ABSENT","DUTY"][i]]}</strong></span>
                    ))}
                  </div>
                  {j && <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 8 }}><BookOpen size={12} style={{ verticalAlign: -1 }} /> Topik: <strong style={{ color: "var(--ink)" }}>{j.topic}</strong></div>}
                  {absentees.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>SISWA TIDAK HADIR</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {absentees.map(([sid, r]) => {
                          const stu = studentById(db, sid);
                          return <div key={sid} style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>
                            <span>{stu ? stu.name : sid}{r.reason ? " — " + r.reason : ""}</span>
                            <StatusBadge status={r.status} />
                          </div>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyReport;
