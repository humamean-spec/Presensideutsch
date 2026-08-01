import React, { useState } from "react";
import { CalendarCheck, CalendarDays, Clock, MapPin, Edit2, Zap } from "lucide-react";
import { EmptyState } from "../../components/common";
import { STATUS_META } from "../../lib/constants";
import { todayISO, formatLongDate, dayNameFromISO, periodRangeLabel } from "../../lib/dateUtils";
import { scheduleForDay, classById, getSession, nextMeetingNumber, sessionStatusFor, summarizeRecords } from "../../lib/aggregations";

function AttendanceHome({ db, goSession, initialDate }) {
  const [date, setDate] = useState(initialDate || todayISO());
  const [pickClassId, setPickClassId] = useState("");
  const dayName = dayNameFromISO(date);
  const daySchedule = scheduleForDay(db, dayName);
  const activeClasses = db.classes.filter(c => !c.archived);

  return (
    <div>
      <div className="pd-card pd-card-pad" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="pd-field" style={{ marginBottom: 0 }}>
            <label>Tanggal Presensi</label>
            <input type="date" className="pd-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", paddingBottom: 9 }}>{formatLongDate(date)}</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div className="pd-field" style={{ marginBottom: 0 }}>
              <label>Sesi kelas lain</label>
              <select className="pd-select" value={pickClassId} onChange={e => setPickClassId(e.target.value)}>
                <option value="">Pilih kelas...</option>
                {activeClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button className="pd-btn pd-btn-soft" disabled={!pickClassId} onClick={() => goSession(pickClassId, date)}>Buka Sesi</button>
          </div>
        </div>
      </div>

      <div className="pd-section-title"><CalendarCheck size={17} color="var(--navy)" /> Jadwal {dayName}</div>
      {daySchedule.length === 0 ? (
        <EmptyState icon={<CalendarDays size={40} />} title="Tidak ada jadwal mengajar pada tanggal ini" sub="Gunakan pilihan 'Sesi kelas lain' di atas untuk presensi susulan." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {daySchedule.map(sch => {
            const cls = classById(db, sch.classId);
            const status = sessionStatusFor(db, sch.classId, date);
            const session = getSession(db, sch.classId, date);
            const meetingNo = session ? session.meetingNumber : nextMeetingNumber(db, sch.classId);
            const summary = session ? summarizeRecords(session.records) : null;
            return (
              <div key={sch.id} className={"pd-class-card " + (status === "DONE" ? "done" : status === "IN_PROGRESS" ? "progress" : "")} onClick={() => goSession(sch.classId, date)}>
                <div className="pd-accent-bar" />
                <div className="pd-flex-between" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{cls ? cls.name : sch.classId}</div>
                  <span className="pd-pill">Pertemuan {meetingNo}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 3, marginBottom: 12 }}>
                  <span><Clock size={11} style={{ verticalAlign: -1 }} /> {periodRangeLabel(sch.periods)}</span>
                  <span><MapPin size={11} style={{ verticalAlign: -1 }} /> {sch.room}</span>
                </div>
                {summary && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    <span className="pd-badge" style={{ background: STATUS_META.PRESENT.bg, color: STATUS_META.PRESENT.color }}>H {summary.PRESENT}</span>
                    <span className="pd-badge" style={{ background: STATUS_META.SICK.bg, color: STATUS_META.SICK.color }}>S {summary.SICK}</span>
                    <span className="pd-badge" style={{ background: STATUS_META.EXCUSED.bg, color: STATUS_META.EXCUSED.color }}>I {summary.EXCUSED}</span>
                    <span className="pd-badge" style={{ background: STATUS_META.ABSENT.bg, color: STATUS_META.ABSENT.color }}>A {summary.ABSENT}</span>
                  </div>
                )}
                <button className="pd-btn pd-btn-block " style={{ background: status === "DONE" ? "var(--navy-tint)" : "var(--navy)", color: status === "DONE" ? "var(--navy)" : "#fff" }}>
                  {status === "DONE" ? <><Edit2 size={13}/> Lihat / Edit</> : status === "IN_PROGRESS" ? <><Zap size={13}/> Lanjutkan Presensi</> : <><CalendarCheck size={13}/> Mulai Presensi</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttendanceHome;
