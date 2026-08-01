import React, { useState } from "react";
import { Plus, School, Users, Edit2, Archive, Trash2 } from "lucide-react";
import { Modal, ConfirmDialog, EmptyState, SegTabs } from "../../components/common";
import { getClassStudents, logActivity } from "../../lib/aggregations";
import { useEntityCrud } from "../../hooks/useEntityCrud";
import ClassForm from "./ClassForm";

function ClassesView({ db, mutate, toast, openClassStudents }) {
  const {
    modal, setModal, confirmDelete, setConfirmDelete,
    confirmArchive, setConfirmArchive, save, remove, toggleArchive,
  } = useEntityCrud({ mutate, arrayKey: "classes" });
  const [showArchived, setShowArchived] = useState(false);

  const list = db.classes.filter(c => !!c.archived === showArchived);

  function saveClass(cls) {
    save(cls, (d, saved, isUpdate) => {
      logActivity(d, "Kelas " + saved.name + " " + (isUpdate ? "diperbarui" : "ditambahkan"));
    });
    toast("Kelas disimpan", "success");
  }

  function archiveClass(cls) {
    toggleArchive(cls);
    toast(cls.archived ? "Kelas diaktifkan kembali" : "Kelas diarsipkan", "success");
  }

  function deleteClass(id) {
    remove(id);
    toast("Kelas dihapus", "success");
  }

  return (
    <div>
      <div className="pd-flex-between" style={{ marginBottom: 16 }}>
        <SegTabs tabs={[{ label: "Aktif", value: false }, { label: "Diarsipkan", value: true }]} value={showArchived} onChange={setShowArchived} />
        <button className="pd-btn pd-btn-primary" onClick={() => setModal({ mode: "add" })}><Plus size={15} /> Tambah Kelas</button>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<School size={40} />} title={showArchived ? "Belum ada kelas diarsipkan" : "Belum ada kelas"} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {list.map(cls => {
            const count = getClassStudents(db, cls.id).length;
            return (
              <div key={cls.id} className="pd-card pd-card-pad">
                <div className="pd-flex-between" style={{ alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{cls.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{cls.academicYear} · Semester {cls.semester}</div>
                  </div>
                  <div className="pd-badge" style={{ background: "var(--navy-tint)", color: "var(--navy)" }}>{count} siswa</div>
                </div>
                <div className="pd-divider" />
                <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 5 }}>
                  <div><strong style={{ color: "var(--ink)" }}>Wali Kelas:</strong> {cls.homeroom || "—"}</div>
                  <div><strong style={{ color: "var(--ink)" }}>Kapasitas:</strong> {count}/{cls.maxStudents}</div>
                  {cls.notes ? <div><strong style={{ color: "var(--ink)" }}>Catatan:</strong> {cls.notes}</div> : null}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button className="pd-btn pd-btn-soft pd-btn-sm" style={{ flex: 1 }} onClick={() => openClassStudents(cls.id)}><Users size={13} /> Lihat Siswa</button>
                  <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => setModal({ mode: "edit", item: cls })}><Edit2 size={14} /></button>
                  <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => setConfirmArchive(cls)}><Archive size={14} /></button>
                  <button className="pd-btn pd-btn-danger pd-btn-icon pd-btn-sm" onClick={() => setConfirmDelete(cls.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Kelas" : "Edit Kelas"} onClose={() => setModal(null)}>
          <ClassForm initial={modal.item} academicYears={db.academicYears} onSave={saveClass} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {confirmArchive && (
        <ConfirmDialog title={confirmArchive.archived ? "Aktifkan Kelas" : "Arsipkan Kelas"}
          message={confirmArchive.archived ? "Kelas ini akan diaktifkan kembali dan muncul di daftar kelas aktif." : "Kelas ini akan dipindahkan ke arsip. Data siswa dan riwayat presensi tetap tersimpan."}
          confirmLabel={confirmArchive.archived ? "Aktifkan" : "Arsipkan"}
          onConfirm={() => archiveClass(confirmArchive)} onCancel={() => setConfirmArchive(null)} />
      )}
      {confirmDelete && (
        <ConfirmDialog title="Hapus Kelas" message="Kelas ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan. Pertimbangkan untuk mengarsipkan kelas alih-alih menghapusnya." confirmLabel="Hapus" danger
          onConfirm={() => deleteClass(confirmDelete)} onCancel={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}

export default ClassesView;
