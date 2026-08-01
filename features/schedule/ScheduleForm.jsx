import React, { useState } from "react";
import { Save } from "lucide-react";
import { DAY_ORDER, PERIOD_TIMES } from "../../lib/dateUtils";
import { uid } from "../../lib/idUtils";

function ScheduleForm({ initial, classes, onSave, onCancel }) {
  const [day, setDay] = useState(initial?.day || "Senin");
  const [startPeriod, setStartPeriod] = useState(initial?.periods?.[0] || 1);
  const [endPeriod, setEndPeriod] = useState(initial?.periods?.[initial.periods.length-1] || initial?.periods?.[0] || 1);
  const [classId, setClassId] = useState(initial?.classId || (classes[0] && classes[0].id) || "");
  const [room, setRoom] = useState(initial?.room || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  function submit() {
    if (!classId) return;
    const s = Math.min(startPeriod, endPeriod), e = Math.max(startPeriod, endPeriod);
    const periods = []; for (let p = s; p <= e; p++) periods.push(p);
    onSave({ id: initial?.id || uid("SCH"), day, periods, classId, room, notes });
  }

  return (
    <>
      <div className="pd-field">
        <label>Hari</label>
        <select className="pd-select" value={day} onChange={e => setDay(e.target.value)}>
          {DAY_ORDER.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="pd-field" style={{ flex: 1 }}>
          <label>Jam Ke- (mulai)</label>
          <select className="pd-select" value={startPeriod} onChange={e => setStartPeriod(Number(e.target.value))}>
            {PERIOD_TIMES.map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
          </select>
        </div>
        <div className="pd-field" style={{ flex: 1 }}>
          <label>Jam Ke- (selesai)</label>
          <select className="pd-select" value={endPeriod} onChange={e => setEndPeriod(Number(e.target.value))}>
            {PERIOD_TIMES.map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
          </select>
        </div>
      </div>
      <div className="pd-field">
        <label>Kelas</label>
        <select className="pd-select" value={classId} onChange={e => setClassId(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="pd-field">
        <label>Ruang</label>
        <input className="pd-input" value={room} onChange={e => setRoom(e.target.value)} placeholder="Contoh: R. XI.A" />
      </div>
      <div className="pd-field">
        <label>Catatan (opsional)</label>
        <input className="pd-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan tambahan" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <button className="pd-btn pd-btn-ghost" onClick={onCancel}>Batal</button>
        <button className="pd-btn pd-btn-primary" onClick={submit}><Save size={14} /> Simpan Jadwal</button>
      </div>
    </>
  );
}

export default ScheduleForm;
