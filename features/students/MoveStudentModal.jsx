import React, { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Modal } from "../../components/common";

function MoveStudentModal({ student, classes, onSave, onCancel }) {
  const [classId, setClassId] = useState(student.classId);
  return (
    <Modal title={"Pindahkan " + student.name} onClose={onCancel} footer={
      <>
        <button className="pd-btn pd-btn-ghost" onClick={onCancel}>Batal</button>
        <button className="pd-btn pd-btn-primary" onClick={() => onSave(classId)}><ArrowRightLeft size={14} /> Pindahkan</button>
      </>
    }>
      <div className="pd-field">
        <label>Pindahkan ke kelas</label>
        <select className="pd-select" value={classId} onChange={e => setClassId(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </Modal>
  );
}

export default MoveStudentModal;
