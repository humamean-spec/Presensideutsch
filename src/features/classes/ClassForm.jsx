import React, { useState } from "react";
import { Save } from "lucide-react";
import { uid } from "../../lib/idUtils";

function ClassForm({ initial, onSave, onCancel, academicYears }) {
  const [name, setName] = useState(initial?.name || "");
  const [grade, setGrade] = useState(initial?.grade || "X");
  const [homeroom, setHomeroom] = useState(initial?.homeroom || "");
  const [maxStudents, setMaxStudents] = useState(initial?.maxStudents || 36);
  const [notes, setNotes] = useState(initial?.notes || "");
  const [academicYear, setAcademicYear] = useState(initial?.academicYear || (academicYears[0] && academicYears[0].label) || "");

  function submit() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id || uid("CLS"), name: name.trim(), grade, homeroom, maxStudents: Number(maxStudents) || 36,
      notes, academicYear, semester: initial?.semester || "Ganjil", archived: initial?.archived || false,
    });
  }

  return (
    <>
      <div className="pd-field"><label>Nama Kelas</label><input className="pd-input" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: XI.K" /></div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="pd-field" style={{ flex: 1 }}>
          <label>Tingkat</label>
          <select className="pd-select" value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="X">X</option><option value="XI">XI</option><option value="XII">XII</option>
          </select>
        </div>
        <div className="pd-field" style={{ flex: 1 }}>
          <label>Tahun Ajaran</label>
          <select className="pd-select" value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
            {academicYears.map(ay => <option key={ay.id} value={ay.label}>{ay.label}</option>)}
          </select>
        </div>
      </div>
      <div className="pd-field"><label>Wali Kelas <span className="pd-hint">(opsional)</span></label><input className="pd-input" value={homeroom} onChange={e => setHomeroom(e.target.value)} /></div>
      <div className="pd-field"><label>Maksimal Siswa</label><input type="number" className="pd-input" value={maxStudents} onChange={e => setMaxStudents(e.target.value)} /></div>
      <div className="pd-field"><label>Catatan</label><textarea className="pd-textarea" value={notes} onChange={e => setNotes(e.target.value)} /></div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <button className="pd-btn pd-btn-ghost" onClick={onCancel}>Batal</button>
        <button className="pd-btn pd-btn-primary" onClick={submit}><Save size={14} /> Simpan Kelas</button>
      </div>
    </>
  );
}

export default ClassForm;
