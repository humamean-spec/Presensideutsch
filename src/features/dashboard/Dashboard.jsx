import React, { useMemo } from "react";
import {
  School, Users, CalendarCheck, TrendingUp, ClipboardList, Target,
  CalendarClock, CalendarDays, Clock, MapPin, AlertTriangle, Sparkles,
} from "lucide-react";
import { StatCard, EmptyState } from "../../components/common";
import { DAY_ORDER, MONTH_NAMES, pad2, todayISO, dayNameFromISO, formatShortDate, periodRangeLabel } from "../../lib/dateUtils";
import { initials } from "../../lib/idUtils";
import {
  scheduleForDay, classById, monthlyOverallRate, computeAlerts, sessionStatusFor, timeAgo,
} from "../../lib/aggregations";

function Dashboard({ db, goAttendance, setView }) {
  const today = todayISO();
  const dayName = dayNameFromISO(today);
  const todaySchedule = useMemo(() => scheduleForDay(db, dayName), [db, dayName]);
  const now = new Date();
  const [y, m] = [now.getFullYear(), now.getMonth()];

  const totalStudents = db.students.filter(s => !s.archived).length;
  const totalClasses = db.classes.filter(c => !c.archived).length;
  const monthlyRate = monthlyOverallRate(db, y, m);
  const totalSessions = Object.keys(db.attendance).length;
  const monthSessions = Object.values(db.attendance).filter(s => s.date.startsWith(y + "-" + pad2(m + 1))).length;

  const todayDone = todaySchedule.filter(sch => sessionStatusFor(db, sch.classId, today) === "DONE").length;

  const alerts = useMemo(() => computeAlerts(db), [db]);

  // upcoming: next 3 schedule items after today (rolling through the week)
  const upcoming = useMemo(() => {
    const idx = DAY_ORDER.indexOf(dayName);
    const out = [];
    for (let i = 1; i <= 5 && out.length < 4; i++) {
      const dn = DAY_ORDER[(idx + i) % 5];
      scheduleForDay(db, dn).forEach(sch => out.push({ ...sch, dayLabel: dn }));
    }
    return out.slice(0, 4);
  }, [db, dayName]);

  return (
    <div>
      <div className="pd-stat-grid">
        <StatCard icon={<School size={18} />} label="Total Kelas" value={totalClasses} tint="#0F2A47" />
        <StatCard icon={<Users size={18} />} label="Total Siswa" value={totalStudents} tint="#C41E3A" />
        <StatCard icon={<CalendarCheck size={18} />} label="Pertemuan Hari Ini" value={todaySchedule.length} tint="#F59E0B" sub={todaySchedule.length ? todayDone + " selesai" : "Tidak ada jadwal"} />
        <StatCard icon={<TrendingUp size={18} />} label="Tingkat Kehadiran Bulan Ini" value={monthlyRate !== null ? monthlyRate + "%" : "—"} tint="#16A34A" />
        <StatCard icon={<ClipboardList size={18} />} label="Total Sesi Mengajar" value={totalSessions} tint="#7C3AED" />
        <StatCard icon={<Target size={18} />} label="Progres Bulan Ini" value={monthSessions + " sesi"} tint="#2563EB" sub={MONTH_NAMES[m] + " " + y} />
      </div>

      <div className="pd-grid-2">
        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 18 }}>
            <div className="pd-flex-between" style={{ marginBottom: 14 }}>
              <div className="pd-section-title" style={{ margin: 0 }}><CalendarClock size={17} color="var(--navy)" /> Jadwal Mengajar Hari Ini</div>
              <span className="pd-pill">{formatShortDate(today)}</span>
            </div>
            {todaySchedule.length === 0 ? (
              <EmptyState icon={<CalendarDays size={40} />} title="Tidak ada jadwal mengajar hari ini" sub="Nikmati waktu luang Anda, atau periksa jadwal minggu ini." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {todaySchedule.map(sch => {
                  const cls = classById(db, sch.classId);
                  const status = sessionStatusFor(db, sch.classId, today);
                  return (
                    <div key={sch.id} className={"pd-class-card " + (status === "DONE" ? "done" : status === "IN_PROGRESS" ? "progress" : "")} style={{ padding: "14px 16px 14px 20px", cursor: "pointer" }} onClick={() => goAttendance(sch.classId, today)}>
                      <div className="pd-accent-bar" />
                      <div className="pd-flex-between">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{cls ? cls.name : sch.classId}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, display: "flex", gap: 12 }}>
                            <span><Clock size={11} style={{ verticalAlign: -1 }} /> {periodRangeLabel(sch.periods)}</span>
                            <span><MapPin size={11} style={{ verticalAlign: -1 }} /> {sch.room}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="pd-badge" style={{
                            background: status === "DONE" ? "#DCFCE7" : status === "IN_PROGRESS" ? "#FFEDD5" : "#F1F5F9",
                            color: status === "DONE" ? "var(--success)" : status === "IN_PROGRESS" ? "var(--warning)" : "var(--muted)"
                          }}>{status === "DONE" ? "Selesai" : status === "IN_PROGRESS" ? "Berlangsung" : "Belum Presensi"}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pd-card pd-card-pad">
            <div className="pd-section-title"><CalendarDays size={17} color="var(--navy)" /> Jadwal Mendatang</div>
            {upcoming.length === 0 ? <div style={{ fontSize: 13, color: "var(--muted)" }}>Tidak ada jadwal lain minggu ini.</div> :
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcoming.map((sch, i) => {
                  const cls = classById(db, sch.classId);
                  return (
                    <div key={i} className="pd-flex-between" style={{ padding: "9px 4px", borderBottom: i < upcoming.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{cls ? cls.name : sch.classId}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{sch.dayLabel}, {periodRangeLabel(sch.periods)}</div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </div>

        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 18 }}>
            <div className="pd-section-title"><AlertTriangle size={17} color="var(--red)" /> Perlu Perhatian</div>
            {alerts.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Tidak ada siswa yang perlu perhatian khusus saat ini.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {alerts.slice(0, 6).map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#FEF2F2", borderRadius: 10 }}>
                    <div className="pd-student-avatar" style={{ width: 30, height: 30, fontSize: 11, background: "#FEE2E2", color: "var(--danger)" }}>{initials(a.studentName)}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.studentName}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {a.className} · {a.type === "LOW_RATE" ? "Kehadiran " + a.rate + "%" : a.type === "CONSECUTIVE_ABSENT" ? "3x alpa berturut-turut" : "Sering sakit"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pd-card pd-card-pad">
            <div className="pd-section-title"><Sparkles size={17} color="var(--navy)" /> Aktivitas Terbaru</div>
            {db.activityLog.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Belum ada aktivitas.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {db.activityLog.slice(0, 6).map(a => (
                  <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)", marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5 }}>{a.message}</div>
                      <div style={{ fontSize: 10.5, color: "var(--muted-2)" }}>{timeAgo(a.at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Schedule view
   ============================================================ */

export default Dashboard;
