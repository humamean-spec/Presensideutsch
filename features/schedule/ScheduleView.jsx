import React from "react";
import { Plus, Copy, Edit2, Trash2 } from "lucide-react";
import { Modal, ConfirmDialog } from "../../components/common";
import { DAY_ORDER, periodRangeLabel, periodLabel } from "../../lib/dateUtils";
import { classById, scheduleForDay, logActivity } from "../../lib/aggregations";
import { uid } from "../../lib/idUtils";
import { useEntityCrud } from "../../hooks/useEntityCrud";
import ScheduleForm from "./ScheduleForm";

function ScheduleView({ db, mutate, toast }) {
  const {
    modal, setModal, confirmDelete, setConfirmDelete, save, remove,
  } = useEntityCrud({ mutate, arrayKey: "schedule" });

  function saveEntry(entry) {
    save(entry, (d, saved) => {
      logActivity(d, "Jadwal " + (classById(d, saved.classId) || {}).name + " pada " + saved.day + " disimpan");
    });
    toast("Jadwal disimpan", "success");
  }

  function deleteEntry(id) {
    remove(id);
    toast("Jadwal dihapus", "success");
  }

  function duplicateEntry(entry) {
    mutate((d) => { d.schedule.push({ ...entry, id: uid("SCH") }); });
    toast("Jadwal diduplikasi", "success");
  }

  const activeClasses = db.classes.filter((c) => !c.archived);

  return (
    <div>
      <div className="pd-flex-between" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Jadwal mengajar mingguan Bahasa Jerman — {db.settings.currentAcademicYear} · Semester {db.settings.currentSemester}</div>
        <button className="pd-btn pd-btn-primary" onClick={() => setModal({ mode: "add" })}><Plus size={15} /> Tambah Jadwal</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {DAY_ORDER.map(day => {
          const items = scheduleForDay(db, day);
          return (
            <div key={day} className="pd-card pd-card-pad">
              <div className="pd-section-title">{day}</div>
              {items.length === 0 ? <div style={{ fontSize: 12.5, color: "var(--muted-2)" }}>Tidak ada jadwal.</div> :
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map(sch => {
                    const cls = classById(db, sch.classId);
                    return (
                      <div key={sch.id} className="pd-flex-between" style={{ padding: "10px 14px", background: "var(--navy-tint)", borderRadius: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 4, height: 32, background: "var(--navy)", borderRadius: 4 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{cls ? cls.name : sch.classId} <span className="pd-pill" style={{ marginLeft: 6 }}>Jam ke-{periodLabel(sch.periods)}</span></div>
                            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{periodRangeLabel(sch.periods)} · {sch.room}{sch.notes ? " · " + sch.notes : ""}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => duplicateEntry(sch)} title="Duplikasi"><Copy size={14} /></button>
                          <button className="pd-btn pd-btn-ghost pd-btn-icon pd-btn-sm" onClick={() => setModal({ mode: "edit", item: sch })} title="Edit"><Edit2 size={14} /></button>
                          <button className="pd-btn pd-btn-danger pd-btn-icon pd-btn-sm" onClick={() => setConfirmDelete(sch.id)} title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Jadwal" : "Edit Jadwal"} onClose={() => setModal(null)}>
          <ScheduleForm initial={modal.item} classes={activeClasses} onSave={saveEntry} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {confirmDelete && (
        <ConfirmDialog title="Hapus Jadwal" message="Jadwal ini akan dihapus secara permanen. Data presensi yang sudah tersimpan tidak akan terpengaruh." confirmLabel="Hapus" danger
          onConfirm={() => deleteEntry(confirmDelete)} onCancel={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}

export default ScheduleView;
