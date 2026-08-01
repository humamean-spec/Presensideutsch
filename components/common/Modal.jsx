import React from "react";
import { X } from "lucide-react";

function Modal({ title, onClose, children, footer, width }) {
  return (
    <div className="pd-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pd-modal" style={width ? { maxWidth: width } : undefined}>
        <div className="pd-modal-head">
          <div className="pd-modal-title">{title}</div>
          <button className="pd-btn pd-btn-ghost pd-btn-icon" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="pd-modal-body">{children}</div>
        {footer ? <div className="pd-modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export default Modal;
