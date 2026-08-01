import React, { useState } from "react";
import { ArrowLeft, Check, Save, BookOpen } from "lucide-react";
import { Modal, StatusButton, StatusBadge } from "../../components/common";
import { STATUS_ORDER, STATUS_META, REASON_PRESETS } from "../../lib/constants";
import { formatLongDate, periodRangeLabel, dayNameFromISO, formatShortDate, sessionKey } from "../../lib/dateUtils";
import { initials, uid } from "../../lib/idUtils";
import {
  classById, studentById, getClassStudents, getSession, nextMeetingNumber, summarizeRecords,
  attendanceRate, logActivity,
} from "../../lib/aggregations";

function nextStatus(cur) {
  const i = STATUS_ORDER.indexOf(cur || "NOT_SET");
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

function AttendanceSession({ db, mutate, toast, classId, dateISO, onBack, goJournal }) {
  const cls = classById(db, classId);
  const students = getClassStudents(db, classId);
  const existing = getSession(db, classId, dateISO);
  const schEntry = db.schedule.find(s => s.classId === classId && s.day === dayNameFromISO(dateISO));

  const [records, setRecords] = useState(() => {
    const init = {};
    students.forEach(s => {
      init[s.id] = existing?.records?.[s.id] || { status: "NOT_SET", reason: "", notes: "" };
    });
    return init;
  });
  const [teacherNote, setTeacherNote] = useState(existing?.teacherNote || "");
  const [reasonModalFor, setReasonModalFor] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const meetingNumber = existing ? existing.meetingNumber : nextMeetingNumber(db, classId);

  function cycle(studentId) {
    setRecords(prev => {
      const cur = prev[studentId] || { status: "NOT_SET", reason: "", notes: "" };
      const ns = nextStatus(cur.status);
      const updated = { ...cur, status: ns };
      if (ns !== "PRESENT" && ns !== "NOT_SET") {
        setTimeout(() => setReasonModalFor(studentId), 10);
      } else {
        updated.reason = ""; updated.notes = "";
      }
      return { ...prev, [studentId]: updated };
    });
  }

  function markAll(status) {
    setRecords(prev => {
      const out = { ...prev };
      Object.keys(out).forEach(k => { out[k] = { ...out[k], status, reason: status === "PRESENT" ? "" : out[k].reason, notes: status === "PRESENT" ? "" : out[k].notes }; });
      return out;
    });
  }

  const summary = summarizeRecords(records);
  const rate = attendanceRate(summary);

  function save(andJournal) {
    mutate(d => {
      const key = sessionKey(classId, dateISO);
      const isNew = !d.attendance[key];
      d.attendance[key] = {
        id: existing?.id || uid("ATT"), classId, date: dateISO, meetingNumber, teacherNote,
        records, createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      if (isNew) d.meetingCounters[classId] = Math.max(d.meetingCounters[classId] || 0, meetingNumber);
      logActivity(d, "Presensi " + (cls ? cls.name : classId) + " (" + formatShortDate(dateISO) + ") disimpan — Pertemuan " + meetingNumber);
    });
    toast("Presensi berhasil disimpan", "success");
    setJustSaved(true);
    if (andJournal) goJournal(classId, dateISO);
  }

  const reasonRecord = reasonModalFor ? records[reasonModalFor] : null;
  const reasonStudent = reasonModalFor ? studentById(db, reasonModalFor) : null;

  return (
    <div>
      <button className="pd-btn pd-btn-ghost pd-btn-sm" style={{ marginBottom: 14 }} onClick={onBack}><ArrowLeft size={14} /> Kembali</button>

      <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
        <div className="pd-flex-between" style={{ flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{cls ? cls.name : classId} · Pertemuan {meetingNumber}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
              {formatLongDate(dateISO)} · {schEntry ? periodRangeLabel(schEntry.periods) : "Jadwal tambahan"} · {schEntry ? schEntry.room : "-"} · {db.settings.currentAcademicYear} Sem. {db.settings.currentSemester}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="pd-btn pd-btn-ghost pd-btn-sm" onClick={() => markAll("PRESENT")}><Check size={13} /> Tandai Semua Hadir</button>
          </div>
        </div>
      </div>

      <div className="pd-grid-2">
        <div>
          <div className="pd-card pd-card-pad">
            <div className="pd-section-title">Daftar Siswa ({students.length})</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {students.map((stu, i) => {
                const rec = records[stu.id] || { status: "NOT_SET" };
                return (
                  <div key={stu.id} className="pd-student-row">
                    <div style={{ fontSize: 11, color: "var(--muted-2)", width: 20, fontWeight: 700 }}>{i + 1}</div>
                    <div className="pd-student-avatar">{initials(stu.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stu.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{stu.nis}{rec.reason ? " · " + rec.reason : ""}</div>
                    </div>
                    <StatusButton status={rec.status} onClick={() => cycle(stu.id)} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div className="pd-section-title">Ringkasan Presensi</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {["PRESENT","EXCUSED","SICK","ABSENT","DUTY"].map(st => (
                <div key={st} style={{ padding: "10px 12px", borderRadius: 12, background: STATUS_META[st].bg }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: STATUS_META[st].color, fontFamily: "'Space Grotesk',sans-serif" }}>{summary[st]}</div>
                  <div style={{ fontSize: 11, color: STATUS_META[st].color, fontWeight: 600 }}>{STATUS_META[st].label}</div>
                </div>
              ))}
            </div>
            <div className="pd-divider" />
            <div className="pd-flex-between">
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Persentase Kehadiran</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: rate === null ? "var(--muted-2)" : "var(--navy)" }}>{rate !== null ? rate + "%" : "—"}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{summary.NOT_SET} siswa belum diisi statusnya</div>
          </div>

          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div className="pd-field" style={{ marginBottom: 0 }}>
              <label>Catatan Guru (opsional)</label>
              <textarea className="pd-textarea" value={teacherNote} onChange={e => setTeacherNote(e.target.value)} placeholder="Catatan untuk pertemuan ini..." />
            </div>
          </div>

          <button className="pd-btn pd-btn-primary pd-btn-block" style={{ marginBottom: 10, padding: "12px" }} onClick={() => save(false)}>
            <Save size={16} /> Simpan Presensi
          </button>
          {justSaved && (
            <button className="pd-btn pd-btn-accent pd-btn-block" style={{ padding: "12px" }} onClick={() => save(true)}>
              <BookOpen size={16} /> Lanjut ke Jurnal Mengajar
            </button>
          )}
        </div>
      </div>

      {reasonModalFor && reasonStudent && (
        <Modal title={"Alasan — " + reasonStudent.name} onClose={() => setReasonModalFor(null)} footer={
          <button className="pd-btn pd-btn-primary" onClick={() => setReasonModalFor(null)}><Check size={14} /> Selesai</button>
        }>
          <div style={{ marginBottom: 12 }}><StatusBadge status={reasonRecord.status} /></div>
          <div className="pd-field">
            <label>Pilih alasan cepat</label>
            <div className="pd-chip-group">
              {REASON_PRESETS.map(r => (
                <div key={r} className={"pd-chip " + (reasonRecord.reason === r ? "selected" : "")}
                  onClick={() => setRecords(prev => ({ ...prev, [reasonModalFor]: { ...prev[reasonModalFor], reason: r } }))}>{r}</div>
              ))}
            </div>
          </div>
          <div className="pd-field">
            <label>Catatan singkat <span className="pd-hint">(maks. 250 karakter)</span></label>
            <textarea className="pd-textarea" maxLength={250} value={reasonRecord.notes}
              onChange={e => setRecords(prev => ({ ...prev, [reasonModalFor]: { ...prev[reasonModalFor], notes: e.target.value } }))}
              placeholder="Detail tambahan..." />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   Teaching Journal
   ============================================================ */

export default AttendanceSession;
