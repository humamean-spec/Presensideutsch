import React, { useState } from "react";
import { Save } from "lucide-react";
import { uid } from "../../lib/idUtils";

function StudentForm({ initial, classes, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [nis, setNis] = useState(initial?.nis || "");
  const [gender, setGender] = useState(initial?.gender || "L");
  const [classId, setClassId] = useState(initial?.classId || (classes[0] && classes[0].id) || "");
  const [birthDate, setBirthDate] = useState(initial?.birthDate || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [parentPhone, setParentPhone] = useState(initial?.parentPhone || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  function submit() {
    if (!name.trim() || !classId) return;
    onSave({
      id: initial?.id || uid("STU"), nis: nis.trim(), name: name.trim(), gender, classId, birthDate,
      phone, parentPhone, email, notes, photo: initial?.photo || null, archived: initial?.archived || false,
    });
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="pd-field" style={{ flex: 2 }}><label>Nama Lengkap</label><input className="pd-input" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="pd-field" style={{ flex: 1 }}><label>NIS</label><input className="pd-input" value={nis} onChange={e => setNis(e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="pd-field" style={{ flex: 1 }}>
          <label>Jenis Kelamin</label>
          <select className="pd-select" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
          </select>
        </div>
        <div className="pd-field" style={{ flex: 1 }}>
          <label>Kelas</label>
          <select className="pd-select" value={classId} onChange={e => setClassId(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="pd-field" style={{ flex: 1 }}><label>Tgl Lahir</label><input type="date" className="pd-input" value={birthDate} onChange={e => setBirthDate(e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="pd-field" style={{ flex: 1 }}><label>No. HP Siswa</label><input className="pd-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <div className="pd-field" style={{ flex: 1 }}><label>No. HP Orang Tua</label><input className="pd-input" value={parentPhone} onChange={e => setParentPhone(e.target.value)} /></div>
      </div>
      <div className="pd-field"><label>Email <span className="pd-hint">(opsional)</span></label><input className="pd-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="pd-field"><label>Catatan</label><textarea className="pd-textarea" value={notes} onChange={e => setNotes(e.target.value)} /></div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <button className="pd-btn pd-btn-ghost" onClick={onCancel}>Batal</button>
        <button className="pd-btn pd-btn-primary" onClick={submit}><Save size={14} /> Simpan Siswa</button>
      </div>
    </>
  );
}

export default StudentForm;
