import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap, School, Settings as SettingsIcon, Sun, Moon, ShieldCheck, Download,
  Upload, RotateCcw, Info, Save,
} from "lucide-react";
import { ConfirmDialog } from "../../components/common";
import { todayISO } from "../../lib/dateUtils";
import { logActivity } from "../../lib/aggregations";

function SettingsView({ db, mutate, toast, onResetSeed }) {
  const s = db.settings;
  const [form, setForm] = useState(s);
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { setForm(s); }, [s]);

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function saveSettings() {
    mutate(d => { d.settings = { ...d.settings, ...form }; logActivity(d, "Pengaturan diperbarui"); });
    toast("Pengaturan disimpan", "success");
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "presensi-deutsch-backup-" + todayISO() + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Backup berhasil diunduh", "success");
  }

  function onFileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.students || !parsed.classes) throw new Error("format tidak valid");
        setConfirmRestore(parsed);
      } catch (err) {
        toast("File backup tidak valid", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div>
      <div className="pd-grid-2">
        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div className="pd-section-title"><GraduationCap size={16} color="var(--navy)" /> Profil Guru</div>
            <div className="pd-field"><label>Nama Guru</label><input className="pd-input" value={form.teacherName} onChange={e => set("teacherName", e.target.value)} /></div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="pd-field" style={{ flex: 1 }}><label>NIP / ID Guru</label><input className="pd-input" value={form.teacherId} onChange={e => set("teacherId", e.target.value)} /></div>
              <div className="pd-field" style={{ flex: 1 }}><label>No. HP</label><input className="pd-input" value={form.teacherPhone} onChange={e => set("teacherPhone", e.target.value)} /></div>
            </div>
            <div className="pd-field"><label>Email</label><input className="pd-input" value={form.teacherEmail} onChange={e => set("teacherEmail", e.target.value)} /></div>
          </div>

          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div className="pd-section-title"><School size={16} color="var(--navy)" /> Profil Sekolah</div>
            <div className="pd-field"><label>Nama Sekolah</label><input className="pd-input" value={form.schoolName} onChange={e => set("schoolName", e.target.value)} /></div>
            <div className="pd-field"><label>Alamat Sekolah</label><input className="pd-input" value={form.schoolAddress} onChange={e => set("schoolAddress", e.target.value)} /></div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="pd-field" style={{ flex: 1 }}>
                <label>Tahun Ajaran Aktif</label>
                <select className="pd-select" value={form.currentAcademicYear} onChange={e => set("currentAcademicYear", e.target.value)}>
                  {db.academicYears.map(ay => <option key={ay.id} value={ay.label}>{ay.label}</option>)}
                </select>
              </div>
              <div className="pd-field" style={{ flex: 1 }}>
                <label>Semester Aktif</label>
                <select className="pd-select" value={form.currentSemester} onChange={e => set("currentSemester", e.target.value)}>
                  <option value="Ganjil">Ganjil</option><option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>

          <button className="pd-btn pd-btn-primary" onClick={saveSettings}><Save size={15} /> Simpan Pengaturan</button>
        </div>

        <div>
          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div className="pd-section-title"><SettingsIcon size={16} color="var(--navy)" /> Preferensi Aplikasi</div>
            <div className="pd-field">
              <label>Tampilan</label>
              <div className="pd-chip-group">
                <div className={"pd-chip " + (form.theme==="light"?"selected":"")} onClick={() => set("theme","light")}><Sun size={12} style={{verticalAlign:-2}}/> Terang</div>
                <div className={"pd-chip " + (form.theme==="dark"?"selected":"")} onClick={() => set("theme","dark")}><Moon size={12} style={{verticalAlign:-2}}/> Gelap</div>
              </div>
            </div>
            <div className="pd-field">
              <label>Format Ekspor Default</label>
              <select className="pd-select" value={form.defaultExportFormat} onChange={e => set("defaultExportFormat", e.target.value)}>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">CSV</option>
                <option value="print">Cetak / PDF (Print)</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
              <span style={{ fontSize: 13 }}>Simpan otomatis</span>
              <input type="checkbox" checked={form.autoSave} onChange={e => set("autoSave", e.target.checked)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
              <span style={{ fontSize: 13 }}>Konfirmasi sebelum simpan presensi</span>
              <input type="checkbox" checked={form.attendanceConfirmation} onChange={e => set("attendanceConfirmation", e.target.checked)} />
            </div>
          </div>

          <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
            <div className="pd-section-title"><ShieldCheck size={16} color="var(--navy)" /> Cadangan Data (Backup)</div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, marginTop: 0 }}>
              Seluruh data — kelas, siswa, presensi, jurnal, dan jadwal — tersimpan otomatis di perangkat ini.
              Unduh cadangan secara berkala agar data tetap aman.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="pd-btn pd-btn-soft" onClick={exportBackup}><Download size={14} /> Unduh Backup (.json)</button>
              <button className="pd-btn pd-btn-ghost" onClick={() => fileRef.current.click()}><Upload size={14} /> Pulihkan dari Backup</button>
              <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={onFileSelected} />
            </div>
            <div className="pd-divider" />
            <button className="pd-btn pd-btn-danger" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> Muat Ulang Data Contoh</button>
          </div>

          <div className="pd-card pd-card-pad">
            <div className="pd-section-title"><Info size={16} color="var(--navy)" /> Tentang</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--ink)" }}>PRESENSI DEUTSCH</strong> v1.0<br />
              Dibuat untuk {db.settings.schoolName}.<br />
              Data disimpan secara lokal &amp; personal pada akun Anda. Ekspor PDF menggunakan fitur cetak browser
              dengan tata letak siap-cetak; ekspor Excel menggunakan format .xlsx asli.
            </div>
          </div>
        </div>
      </div>

      {confirmRestore && (
        <ConfirmDialog title="Pulihkan Backup" danger
          message="Data saat ini akan DIGANTI SELURUHNYA dengan data dari file backup ini. Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah mengunduh backup terbaru sebelum melanjutkan."
          confirmLabel="Ya, Pulihkan"
          onConfirm={() => { mutate(() => confirmRestore); setConfirmRestore(null); toast("Data berhasil dipulihkan", "success"); }}
          onCancel={() => setConfirmRestore(null)} />
      )}
      {confirmReset && (
        <ConfirmDialog title="Muat Ulang Data Contoh" danger
          message="Seluruh data (kelas, siswa, presensi, jurnal) akan dihapus dan diganti dengan data contoh awal (5 kelas Bahasa Jerman & siswa riil). Tindakan ini tidak dapat dibatalkan."
          confirmLabel="Ya, Muat Ulang"
          onConfirm={() => { onResetSeed(); setConfirmReset(false); }}
          onCancel={() => setConfirmReset(false)} />
      )}
    </div>
  );
}

export default SettingsView;
