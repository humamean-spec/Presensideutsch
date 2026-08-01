import React from "react";
import { ArrowLeft, Phone, Mail, StickyNote, CalendarClock, ListChecks } from "lucide-react";
import { EmptyState, StatusBadge } from "../../components/common";
import { formatShortDate } from "../../lib/dateUtils";
import { initials } from "../../lib/idUtils";
import {
  classById, studentById, sessionsForClass, studentStatsAcrossSessions,
} from "../../lib/aggregations";
import { STATUS_META } from "../../lib/constants";

function StudentProfile({ db, studentId, onBack }) {
  const stu = studentById(db, studentId);
  if (!stu) return <EmptyState icon={<Users size={40} />} title="Siswa tidak ditemukan" />;
  const cls = classById(db, stu.classId);
  const sessions = sessionsForClass(db, stu.classId).filter(s => s.records[stu.id] && s.records[stu.id].status && s.records[stu.id].status !== "NOT_SET");
  const stats = studentStatsAcrossSessions(sessions, stu.id);
  const rate = stats.total > 0 ? Math.round((stats.PRESENT / stats.total) * 1000) / 10 : null;

  const timeline = [...sessions].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 25);

  return (
    <div>
      <button className="pd-btn pd-btn-ghost pd-btn-sm" style={{ marginBottom: 16 }} onClick={onBack}><ArrowLeft size={14} /> Kembali</button>
      <div className="pd-grid-2">
        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div className="pd-student-avatar" style={{ width: 60, height: 60, fontSize: 20 }}>{initials(stu.name)}</div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{stu.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>NIS {stu.nis} · {cls ? cls.name : "—"} · {stu.gender === "L" ? "Laki-laki" : "Perempuan"}</div>
              </div>
            </div>
            <div className="pd-divider" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5 }}>
              <div><Phone size={12} style={{ verticalAlign: -1 }} /> {stu.phone || "—"}</div>
              <div><Phone size={12} style={{ verticalAlign: -1 }} /> Ortu: {stu.parentPhone || "—"}</div>
              <div><Mail size={12} style={{ verticalAlign: -1 }} /> {stu.email || "—"}</div>
              <div>Lahir: {stu.birthDate || "—"}</div>
            </div>
            {stu.notes ? <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 10 }}><StickyNote size={12} style={{ verticalAlign: -1 }} /> {stu.notes}</div> : null}
          </div>

          <div className="pd-card pd-card-pad">
            <div className="pd-section-title"><CalendarClock size={16} color="var(--navy)" /> Riwayat Presensi</div>
            {timeline.length === 0 ? <div style={{ fontSize: 13, color: "var(--muted)" }}>Belum ada riwayat presensi.</div> :
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflowY: "auto" }}>
                {timeline.map(s => {
                  const rec = s.records[stu.id];
                  return (
                    <div key={s.id} className="pd-flex-between" style={{ padding: "8px 12px", borderRadius: 10, background: "var(--navy-tint)" }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{formatShortDate(s.date)} <span style={{ color: "var(--muted)", fontWeight: 400 }}>· Pertemuan {s.meetingNumber}</span></div>
                        {rec.reason ? <div style={{ fontSize: 11, color: "var(--muted)" }}>{rec.reason}</div> : null}
                      </div>
                      <StatusBadge status={rec.status} />
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </div>

        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>TINGKAT KEHADIRAN</div>
            <div style={{ fontSize: 42, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: rate === null ? "var(--muted-2)" : rate < 80 ? "var(--danger)" : "var(--success)", margin: "6px 0" }}>
              {rate !== null ? rate + "%" : "—"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>dari {stats.total} pertemuan tercatat</div>
          </div>
          <div className="pd-card pd-card-pad">
            <div className="pd-section-title" style={{ marginBottom: 12 }}><ListChecks size={16} color="var(--navy)" /> Rekap Status</div>
            {["PRESENT","EXCUSED","SICK","ABSENT","DUTY"].map(st => {
              const m = STATUS_META[st];
              const val = stats[st] || 0;
              const pct = stats.total > 0 ? (val / stats.total) * 100 : 0;
              return (
                <div key={st} style={{ marginBottom: 10 }}>
                  <div className="pd-flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{m.label}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{val}</span>
                  </div>
                  <div className="pd-progress-track"><div className="pd-progress-fill" style={{ width: pct + "%", background: m.color }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Attendance
   ============================================================ */

export default StudentProfile;
