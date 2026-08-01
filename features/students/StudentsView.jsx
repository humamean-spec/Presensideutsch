import React, { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, Users, ArrowRightLeft, Edit2, Archive, Trash2 } from "lucide-react";
import { Modal, ConfirmDialog, EmptyState, SegTabs } from "../../components/common";
import { classById, logActivity } from "../../lib/aggregations";
import { initials } from "../../lib/idUtils";
import { useEntityCrud } from "../../hooks/useEntityCrud";
import StudentForm from "./StudentForm";
import MoveStudentModal from "./MoveStudentModal";

function StudentsView({ db, mutate, toast, initialClassId, openProfile }) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState(initialClassId || "ALL");
  const [sortBy, setSortBy] = useState("name");
  const [showArchived, setShowArchived] = useState(false);
  const [moveModal, setMoveModal] = useState(null);

  const {
    modal, setModal, confirmDelete, setConfirmDelete,
    confirmArchive, setConfirmArchive, save, remove, toggleArchive,
  } = useEntityCrud({ mutate, arrayKey: "students" });

  useEffect(() => { if (initialClassId) setClassFilter(initialClassId); }, [initialClassId]);

  const activeClasses = db.classes.filter(c => !c.archived);

  const filtered = useMemo(() => {
    let list = db.students.filter(s => !!s.archived === showArchived);
    if (classFilter !== "ALL") list = list.filter(s => s.classId === classFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.nis.includes(q));
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "nis") return a.nis.localeCompare(b.nis);
      if (sortBy === "class") return a.classId.localeCompare(b.classId);
      return 0;
    });
    return list;
  }, [db.students, classFilter, query, sortBy, showArchived]);

  function saveStudent(stu) {
    save(stu, (d, saved, isUpdate) => {
      logActivity(d, "Siswa " + saved.name + " " + (isUpdate ? "diperbarui" : "ditambahkan"));
    });
    toast("Data siswa disimpan", "success");
  }

  function moveStudent(stu, newClassId) {
    mutate(d => { const s = d.students.find(x => x.id === stu.id); s.classId = newClassId; });
    setMoveModal(null);
    toast("Siswa dipindahkan ke kelas baru", "success");
  }

  function archiveStudent(stu) {
    toggleArchive(stu);
    toast(stu.archived ? "Siswa diaktifkan kembali" : "Siswa diarsipkan", "success");
  }

  function deleteStudent(id) {
    remove(id);
    toast("Siswa dihapus", "success");
  }

  return (
    <div>
      <div className="pd-card pd-card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div className="pd-search-wrap" style={{ flex: "1 1 220px" }}>
            <Search size={15} />
            <input className="pd-input" placeholder="Cari nama atau NIS..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="pd-select" style={{ width: 150 }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="ALL">Semua Kelas</option>
            {activeClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="pd-select" style={{ width: 150 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Urut: Nama</option>
            <option value="nis">Urut: NIS</option>
            <option value="class">Urut: Kelas</option>
          </select>
          <SegTabs tabs={[{ label: "Aktif", value: false }, { label: "Arsip", value: true }]} value={showArchived} onChange={setShowArchived} />
          <button className="pd-btn pd-btn-primary" style={{ marginLeft: "auto" }} onClick={() => setModal({ mode: "add" })}><UserPlus size={15} /> Tambah Siswa</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="Tidak ada siswa ditemukan" sub="Coba ubah kata kunci pencarian atau filter kelas." />
      ) : (
        <div className="pd-table-wrap">
          <table className="pd-table">
            <thead><tr>
              <th>Siswa</th><th>NIS</th><th>Kelas</th><th>Kontak</th><th style={{ textAlign: "right" }}>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.map(stu => {
                const cls = classById(db, stu.classId);
                return (
                  <tr key={stu.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => openProfile(stu.id)}>
                        <div className="pd-student-avatar">{initials(stu.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{stu.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{stu.gender === "L" ? "Laki-laki" : "Perempuan"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="pd-mono">{stu.nis}</td>
                    <td><span className="pd-pill">{cls ? cls.name : "—"}</span></td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{stu.phone || stu.parentPhone || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => setMoveModal(stu)} title="Pindah Kelas"><ArrowRightLeft size={13} /></button>
                        <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => setModal({ mode: "edit", item: stu })} title="Edit"><Edit2 size={13} /></button>
                        <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => setConfirmArchive(stu)} title="Arsip"><Archive size={13} /></button>
                        <button className="pd-btn pd-btn-danger pd-btn-icon pd-btn-sm" onClick={() => setConfirmDelete(stu.id)} title="Hapus"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Siswa" : "Edit Siswa"} onClose={() => setModal(null)} width={620}>
          <StudentForm initial={modal.item} classes={activeClasses} onSave={saveStudent} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {moveModal && <MoveStudentModal student={moveModal} classes={activeClasses} onSave={(cid) => moveStudent(moveModal, cid)} onCancel={() => setMoveModal(null)} />}
      {confirmArchive && (
        <ConfirmDialog title={confirmArchive.archived ? "Aktifkan Siswa" : "Arsipkan Siswa"}
          message={"Siswa " + confirmArchive.name + " akan " + (confirmArchive.archived ? "diaktifkan kembali." : "dipindahkan ke arsip. Riwayat presensi tetap tersimpan.")}
          confirmLabel={confirmArchive.archived ? "Aktifkan" : "Arsipkan"}
          onConfirm={() => archiveStudent(confirmArchive)} onCancel={() => setConfirmArchive(null)} />
      )}
      {confirmDelete && (
        <ConfirmDialog title="Hapus Siswa" message="Data siswa ini akan dihapus permanen beserta relasinya. Tindakan ini tidak dapat dibatalkan." confirmLabel="Hapus" danger
          onConfirm={() => deleteStudent(confirmDelete)} onCancel={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}

export default StudentsView;
