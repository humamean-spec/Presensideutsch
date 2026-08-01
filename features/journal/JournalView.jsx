import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Plus, BookOpen, ChevronRight } from "lucide-react";
import { EmptyState } from "../../components/common";
import { todayISO, formatShortDate } from "../../lib/dateUtils";
import { classById } from "../../lib/aggregations";
import JournalEditor from "./JournalEditor";

function JournalView({ db, mutate, toast, prefill, clearPrefill }) {
  const [classId, setClassId] = useState(prefill?.classId || (db.classes[0] && db.classes[0].id) || "");
  const [dateISO, setDateISO] = useState(prefill?.dateISO || todayISO());
  const [mode, setMode] = useState(prefill ? "edit" : "list");

  useEffect(() => {
    if (prefill) { setClassId(prefill.classId); setDateISO(prefill.dateISO); setMode("edit"); clearPrefill && clearPrefill(); }
  }, [prefill]);

  const activeClasses = db.classes.filter(c => !c.archived);
  const entries = useMemo(() => Object.values(db.journal).sort((a,b) => b.date.localeCompare(a.date)), [db.journal]);

  if (mode === "edit") {
    return (
      <div>
        <button className="pd-btn pd-btn-ghost pd-btn-sm" style={{ marginBottom: 14 }} onClick={() => setMode("list")}><ArrowLeft size={14} /> Kembali ke Daftar Jurnal</button>
        <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="pd-field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Kelas</label>
              <select className="pd-select" value={classId} onChange={e => setClassId(e.target.value)}>
                {activeClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="pd-field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Tanggal</label>
              <input type="date" className="pd-input" value={dateISO} onChange={e => setDateISO(e.target.value)} />
            </div>
          </div>
        </div>
        <JournalEditor key={classId + dateISO} db={db} classId={classId} dateISO={dateISO} mutate={mutate} toast={toast} onDone={() => setMode("list")} />
      </div>
    );
  }

  return (
    <div>
      <div className="pd-flex-between" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{entries.length} entri jurnal tersimpan</div>
        <button className="pd-btn pd-btn-primary" onClick={() => setMode("edit")}><Plus size={15} /> Tulis Jurnal Baru</button>
      </div>
      {entries.length === 0 ? (
        <EmptyState icon={<BookOpen size={40} />} title="Belum ada jurnal mengajar" sub="Mulai dari sesi presensi, atau tulis jurnal baru secara manual." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {entries.map(j => {
            const cls = classById(db, j.classId);
            return (
              <div key={j.id} className="pd-card pd-card-pad" style={{ cursor: "pointer" }} onClick={() => { setClassId(j.classId); setDateISO(j.date); setMode("edit"); }}>
                <div className="pd-flex-between">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{j.topic || "(Tanpa topik)"}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{cls ? cls.name : j.classId} · Pertemuan {j.meetingNumber} · {formatShortDate(j.date)}</div>
                  </div>
                  <ChevronRight size={16} color="var(--muted-2)" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Reports — Daily / Weekly / Monthly + Export
   ============================================================ */

export default JournalView;
