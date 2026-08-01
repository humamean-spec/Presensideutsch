import React from "react";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

function ToastStack({ toasts }) {
  return (
    <div className="pd-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={"pd-toast " + (t.type || "")}>
          {t.type === "success" ? <CheckCircle2 size={16} /> : t.type === "error" ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
