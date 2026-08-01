import React, { useState, useMemo } from "react";
import { FileSpreadsheet, Printer, TrendingUp, ClipboardList, Users, AlertTriangle, Award, FileText } from "lucide-react";
import { StatCard, EmptyState, MiniBar } from "../../components/common";
import { pad2, MONTH_NAMES } from "../../lib/dateUtils";
import { getClassStudents, studentStatsAcrossSessions, classById, summarizeRecords } from "../../lib/aggregations";
import { exportRowsToExcel, printReport } from "./exporters";

function MonthlyReport({ db }) {
  const now = new Date();
  const [classId, setClassId] = useState(db.classes[0] && db.classes[0].id);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const activeClasses = db.classes.filter(c => !c.archived);
  const prefix = year + "-" + pad2(month + 1);
  const sessions = useMemo(() => Object.values(db.attendance).filter(s => s.classId === classId && s.date.startsWith(prefix)).sort((a,b)=>a.date.localeCompare(b.date)), [db.attendance, classId, prefix]);
  const students = getClassStudents(db, classId);

  let totals = { PRESENT:0, EXCUSED:0, SICK:0, ABSENT:0, DUTY:0, total:0 };
  sessions.forEach(s => { const sum = summarizeRecords(s.records); ["PRESENT","EXCUSED","SICK","ABSENT","DUTY"].forEach(k=>totals[k]+=sum[k]); totals.total += (sum.total - sum.NOT_SET); });
  const overallRate = totals.total > 0 ? Math.round((totals.PRESENT/totals.total)*1000)/10 : null;

  const perStudent = useMemo(() => students.map(stu => {
    const stats = studentStatsAcrossSessions(sessions, stu.id);
    const rate = stats.total > 0 ? Math.round((stats.PRESENT/stats.total)*1000)/10 : null;
    return { stu, stats, rate };
  }).sort((a,b) => (b.rate||0) - (a.rate||0)), [sessions, students]);

  function doExport() {
    const rows = [["Nama","NIS","Hadir","Izin","Sakit","Alpa","Tugas Sekolah","Kehadiran %"]];
    perStudent.forEach(({stu, stats, rate}) => rows.push([stu.name, stu.nis, stats.PRESENT, stats.EXCUSED, stats.SICK, stats.ABSENT, stats.DUTY, rate!==null?rate+"%":"-"]));
    exportRowsToExcel([{ name: "Laporan Bulanan", rows }], "Laporan-Bulanan-" + classById(db,classId)?.name + "-" + prefix + ".xlsx");
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
            <label>Bulan</label>
            <select className="pd-select" value={month} onChange={e => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((m,i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="pd-field" style={{ marginBottom: 0 }}>
            <label>Tahun</label>
            <select className="pd-select" value={year} onChange={e => setYear(Number(e.target.value))}>
              {[now.getFullYear()-1, now.getFullYear(), now.getFullYear()+1].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pd-btn pd-btn-ghost" onClick={doExport}><FileSpreadsheet size={15} /> Excel</button>
          <button className="pd-btn pd-btn-ghost" onClick={printReport}><Printer size={15} /> Cetak / PDF</button>
        </div>
      </div>

      <div className="pd-stat-grid">
        <StatCard icon={<TrendingUp size={17} />} label="Kehadiran Bulan Ini" value={overallRate!==null?overallRate+"%":"—"} tint="#16A34A" />
        <StatCard icon={<ClipboardList size={17} />} label="Total Pertemuan" value={sessions.length} tint="#0F2A47" />
        <StatCard icon={<Users size={17} />} label="Jumlah Siswa" value={students.length} tint="#2563EB" />
        <StatCard icon={<AlertTriangle size={17} />} label="Perlu Perhatian" value={perStudent.filter(p=>p.rate!==null && p.rate<80).length} tint="#DC2626" />
      </div>

      <div className="pd-card pd-card-pad">
        <div className="pd-section-title"><Award size={16} color="var(--navy)" /> Peringkat & Rekap Kehadiran Siswa — {MONTH_NAMES[month]} {year}</div>
        {sessions.length === 0 ? <EmptyState icon={<FileText size={36} />} title="Belum ada data presensi bulan ini" /> :
          <div className="pd-table-wrap"><table className="pd-table">
            <thead><tr><th>#</th><th>Nama</th><th>H</th><th>I</th><th>S</th><th>A</th><th>T</th><th>Kehadiran</th></tr></thead>
            <tbody>{perStudent.map((p, i) => (
              <tr key={p.stu.id}>
                <td>{i+1}</td>
                <td style={{ fontWeight: 600 }}>{p.stu.name}</td>
                <td>{p.stats.PRESENT}</td><td>{p.stats.EXCUSED}</td><td>{p.stats.SICK}</td><td>{p.stats.ABSENT}</td><td>{p.stats.DUTY}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><MiniBar pct={p.rate||0} color={p.rate!==null && p.rate<80 ? "var(--danger)" : "var(--success)"} /><span style={{ fontSize: 12, fontWeight: 700 }}>{p.rate!==null?p.rate+"%":"—"}</span></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        }
      </div>
    </div>
  );
}

export default MonthlyReport;
