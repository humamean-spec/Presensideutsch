import React, { useState } from "react";
import { CheckCircle2, Info, Save } from "lucide-react";
import { TEACHING_METHODS, LEARNING_MEDIA, ASSESSMENT_TYPES } from "../../lib/constants";
import { formatLongDate, formatShortDate, sessionKey } from "../../lib/dateUtils";
import { uid, toggleInArray } from "../../lib/idUtils";
import { classById, nextMeetingNumber, logActivity } from "../../lib/aggregations";

function JournalEditor({ db, classId, dateISO, onDone, mutate, toast, embedded }) {
  const cls = classById(db, classId);
  const key = sessionKey(classId, dateISO);
  const attSession = db.attendance[key];
  const existing = db.journal[key];
  const meetingNumber = attSession ? attSession.meetingNumber : nextMeetingNumber(db, classId);

  const [topic, setTopic] = useState(existing?.topic || "");
  const [objectives, setObjectives] = useState(existing?.objectives || "");
  const [methods, setMethods] = useState(existing?.methods || []);
  const [media, setMedia] = useState(existing?.media || []);
  const [assessment, setAssessment] = useState(existing?.assessment || []);
  const [reflection, setReflection] = useState(existing?.reflection || "");
  const [homework, setHomework] = useState(existing?.homework || "");
  const [notes, setNotes] = useState(existing?.notes || "");

  function save() {
    if (!topic.trim()) { toast("Topik pembelajaran wajib diisi", "error"); return; }
    mutate(d => {
      d.journal[key] = {
        id: existing?.id || uid("JRN"), classId, date: dateISO, meetingNumber, topic, objectives,
        methods, media, assessment, reflection, homework, notes,
        createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      if (!attSession) d.meetingCounters[classId] = Math.max(d.meetingCounters[classId] || 0, meetingNumber);
      logActivity(d, "Jurnal mengajar " + (cls ? cls.name : classId) + " (" + formatShortDate(dateISO) + ") disimpan");
    });
    toast("Jurnal mengajar disimpan", "success");
    if (onDone) onDone();
  }

  return (
    <div className={embedded ? "" : "pd-card pd-card-pad"}>
      <div className="pd-flex-between" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif" }}>{cls ? cls.name : classId} · Pertemuan {meetingNumber}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{formatLongDate(dateISO)}</div>
        </div>
        {attSession ? <span className="pd-badge" style={{ background: "#DCFCE7", color: "var(--success)" }}><CheckCircle2 size={12} /> Terhubung ke presensi</span> :
          <span className="pd-badge" style={{ background: "#FFEDD5", color: "var(--warning)" }}><Info size={12} /> Belum ada presensi tanggal ini</span>}
      </div>

      <div className="pd-field">
        <label>Topik / Kapitel</label>
        <input className="pd-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Contoh: Kapitel 3 — Familie" />
      </div>
      <div className="pd-field">
        <label>Tujuan Pembelajaran</label>
        <textarea className="pd-textarea" value={objectives} onChange={e => setObjectives(e.target.value)} placeholder="Siswa mampu..." />
      </div>
      <div className="pd-field">
        <label>Metode Pembelajaran</label>
        <div className="pd-chip-group">
          {TEACHING_METHODS.map(m => (
            <div key={m} className={"pd-chip " + (methods.includes(m) ? "selected" : "")} onClick={() => setMethods(toggleInArray(methods, m))}>{m}</div>
          ))}
        </div>
      </div>
      <div className="pd-field">
        <label>Media Pembelajaran</label>
        <div className="pd-chip-group">
          {LEARNING_MEDIA.map(m => (
            <div key={m} className={"pd-chip " + (media.includes(m) ? "selected" : "")} onClick={() => setMedia(toggleInArray(media, m))}>{m}</div>
          ))}
        </div>
      </div>
      <div className="pd-field">
        <label>Penilaian</label>
        <div className="pd-chip-group">
          {ASSESSMENT_TYPES.map(m => (
            <div key={m} className={"pd-chip " + (assessment.includes(m) ? "selected" : "")} onClick={() => setAssessment(toggleInArray(assessment, m))}>{m}</div>
          ))}
        </div>
      </div>
      <div className="pd-field">
        <label>Refleksi Pembelajaran</label>
        <textarea className="pd-textarea" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Apa yang berjalan baik? Apa yang perlu diperbaiki?" />
      </div>
      <div className="pd-field">
        <label>Tugas / PR <span className="pd-hint">(opsional)</span></label>
        <textarea className="pd-textarea" value={homework} onChange={e => setHomework(e.target.value)} />
      </div>
      <div className="pd-field">
        <label>Catatan Guru</label>
        <textarea className="pd-textarea" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <button className="pd-btn pd-btn-primary pd-btn-block" style={{ padding: 12 }} onClick={save}><Save size={16} /> Simpan Jurnal</button>
    </div>
  );
}

export default JournalEditor;
