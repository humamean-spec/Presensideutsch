import React, { useState } from "react";
import { LogIn, Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { signIn } from "../../lib/auth";

/**
 * Shared login screen for cloud sync. One email/password, shared by
 * Pak Humam and the 1-2 trusted people who also use the app (see
 * src/lib/auth.js for why this is a shared-account model, not
 * per-teacher accounts).
 *
 * Only ever rendered when cloud sync is configured AND nobody is signed
 * in yet on this device — see the auth gate in App.jsx.
 */
function LoginScreen({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) {
      setError(
        err.toLowerCase().includes("invalid")
          ? "Email atau kata sandi salah."
          : "Gagal masuk: " + err
      );
      return;
    }
    onSignedIn && onSignedIn();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F2A47",
        backgroundImage: "radial-gradient(circle at 20% 0%, #1E4368 0%, #0F2A47 55%)",
        padding: 20,
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 14, background: "#0F2A47",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px", color: "#fff",
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#16202B" }}>
            Presensi Deutsch
          </div>
          <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 4 }}>
            Masuk dengan akun bersama untuk sinkronisasi data
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@sekolah.sch.id"
                autoComplete="username"
                style={{
                  width: "100%", padding: "10px 12px 10px 34px", borderRadius: 10,
                  border: "1px solid #E4E9F0", fontSize: 13.5, boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 6 }}>Kata Sandi</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "10px 12px 10px 34px", borderRadius: 10,
                  border: "1px solid #E4E9F0", fontSize: 13.5, boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "#DC2626",
              background: "#FEF2F2", borderRadius: 10, padding: "9px 12px", marginBottom: 14,
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px", borderRadius: 10, border: "none",
              background: "#C41E3A", color: "#fff", fontWeight: 700, fontSize: 13.5,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <LogIn size={15} /> {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>
          Belum punya akun? Minta Pak Humam membuatkan lewat<br />Supabase → Authentication → Add user.
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
