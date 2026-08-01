import React from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Generic error boundary (audit finding H4).
 *
 * Before this existed, any uncaught error thrown by any component in the
 * tree white-screened the entire app with no recovery path. This wraps a
 * section of the UI (e.g. the routed view inside App) so a broken screen
 * degrades to an inline message instead of taking down the whole app.
 *
 * No behavior change when nothing throws — this is purely a safety net.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Intentionally minimal: no telemetry/reporting infrastructure exists yet.
    // eslint-disable-next-line no-console
    console.error("PresensiDeutsch: caught render error", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="pd-card pd-card-pad" style={{ textAlign: "center", padding: 40 }}>
          <AlertTriangle size={32} color="var(--danger)" style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
            {this.props.label ? "Terjadi kesalahan pada " + this.props.label : "Terjadi kesalahan"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>
            Bagian ini gagal ditampilkan. Data Anda tetap aman dan tersimpan.
          </div>
          <button className="pd-btn pd-btn-primary" onClick={this.handleReset}>
            Coba Lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
