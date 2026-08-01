import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} footer={
      <>
        <button className="pd-btn pd-btn-ghost" onClick={onCancel}>Batal</button>
        <button className={"pd-btn " + (danger ? "pd-btn-danger" : "pd-btn-primary")} onClick={onConfirm}>{confirmLabel || "Konfirmasi"}</button>
      </>
    }>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: danger ? "#FEF2F2" : "var(--navy-tint)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AlertTriangle size={20} color={danger ? "var(--danger)" : "var(--navy)"} />
        </div>
        <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, paddingTop: 4 }}>{message}</div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
