/** The application's CSS design system, injected via a <style> tag in App. */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

.pd-root {
  --navy: #0F2A47;
  --navy-dark: #081826;
  --navy-light: #1E4368;
  --navy-tint: #EAF0F6;
  --red: #C41E3A;
  --red-dark: #9E1730;
  --gold: #C9A227;
  --white: #FFFFFF;
  --bg: #F4F6F9;
  --card: #FFFFFF;
  --ink: #16202B;
  --muted: #64748B;
  --muted-2: #94A3B8;
  --border: #E4E9F0;
  --success: #16A34A;
  --warning: #F59E0B;
  --danger: #DC2626;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow-sm: 0 1px 2px rgba(15,42,71,0.06), 0 1px 1px rgba(15,42,71,0.04);
  --shadow-md: 0 8px 24px rgba(15,42,71,0.08), 0 2px 6px rgba(15,42,71,0.04);
  --shadow-lg: 0 16px 40px rgba(15,42,71,0.14);
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  position: relative;
}
.pd-root.dark {
  --bg: #0B1622;
  --card: #101E2E;
  --ink: #EAF0F6;
  --muted: #93A3B8;
  --muted-2: #64748B;
  --border: #1E2E40;
  --navy-tint: #142236;
}
.pd-root * { box-sizing: border-box; }
.pd-display { font-family: 'Space Grotesk', 'Inter', sans-serif; }
.pd-mono { font-family: 'JetBrains Mono', monospace; }

.pd-triband { height: 3px; width: 100%; background: linear-gradient(90deg, #16171A 0 33.3%, var(--red) 33.3% 66.6%, var(--gold) 66.6% 100%); border-radius: 2px; }

.pd-shell { display: flex; min-height: 100vh; }

/* ---- sidebar ---- */
.pd-sidebar {
  width: 264px; flex-shrink: 0; background: var(--navy);
  background-image: radial-gradient(circle at 20% 0%, var(--navy-light) 0%, var(--navy) 55%);
  color: #fff; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh;
}
.pd-sidebar-head { padding: 22px 20px 16px; }
.pd-brand { display: flex; align-items: center; gap: 12px; }
.pd-brand img { width: 40px; height: 40px; border-radius: 10px; background: #fff; object-fit: contain; padding: 3px; }
.pd-brand-name { font-size: 17px; font-weight: 700; letter-spacing: 0.3px; line-height: 1.15; }
.pd-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; }
.pd-sidebar .pd-triband { margin-top: 14px; opacity: 0.9; }

.pd-nav { flex: 1; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.pd-nav-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
  color: rgba(255,255,255,0.72); font-size: 13.5px; font-weight: 500; cursor: pointer;
  transition: background 0.15s, color 0.15s; border: none; background: transparent; text-align: left; width: 100%;
}
.pd-nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.pd-nav-item.active { background: #fff; color: var(--navy); font-weight: 600; }
.pd-nav-item svg { flex-shrink: 0; }

.pd-sidebar-foot { padding: 14px 20px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
.pd-teacher-chip { display: flex; align-items: center; gap: 10px; }
.pd-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--red); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.pd-teacher-chip-name { font-size: 12.5px; font-weight: 600; }
.pd-teacher-chip-role { font-size: 10.5px; color: rgba(255,255,255,0.55); }

/* ---- main ---- */
.pd-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.pd-topbar {
  height: 64px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; background: var(--card); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 20;
}
.pd-topbar-title { font-size: 18px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
.pd-topbar-date { font-size: 12.5px; color: var(--muted); margin-top: 1px; }
.pd-content { padding: 26px 28px 100px; flex: 1; }

.pd-menu-btn { display: none; background: none; border: none; cursor: pointer; color: var(--ink); }

/* ---- cards ---- */
.pd-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
.pd-card-pad { padding: 20px; }
.pd-section-title { font-size: 15px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin: 0 0 14px; display:flex; align-items:center; gap: 8px; }

.pd-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 22px; }
.pd-stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
.pd-stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.pd-stat-value { font-size: 24px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; line-height: 1.1; }
.pd-stat-label { font-size: 12px; color: var(--muted); margin-top: 3px; }

.pd-grid-2 { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
.pd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

/* ---- buttons ---- */
.pd-btn {
  display: inline-flex; align-items: center; gap: 7px; font-size: 13.5px; font-weight: 600; padding: 9px 16px;
  border-radius: 10px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; font-family: inherit; white-space: nowrap;
}
.pd-btn-primary { background: var(--navy); color: #fff; }
.pd-btn-primary:hover { background: var(--navy-light); }
.pd-btn-accent { background: var(--red); color: #fff; }
.pd-btn-accent:hover { background: var(--red-dark); }
.pd-btn-ghost { background: transparent; color: var(--ink); border-color: var(--border); }
.pd-btn-ghost:hover { background: var(--navy-tint); }
.pd-btn-soft { background: var(--navy-tint); color: var(--navy); }
.pd-btn-soft:hover { filter: brightness(0.96); }
.pd-btn-danger { background: #FEF2F2; color: var(--danger); }
.pd-btn-danger:hover { background: #FEE2E2; }
.pd-btn-sm { padding: 6px 11px; font-size: 12.5px; border-radius: 8px; }
.pd-btn-icon { padding: 8px; border-radius: 9px; }
.pd-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.pd-btn-block { width: 100%; justify-content: center; }

.pd-fab {
  position: fixed; bottom: 26px; right: 28px; width: 56px; height: 56px; border-radius: 50%;
  background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-lg); border: none; cursor: pointer; z-index: 40; transition: transform 0.15s;
}
.pd-fab:hover { transform: scale(1.06); }
.pd-fab-menu { position: fixed; bottom: 92px; right: 28px; display: flex; flex-direction: column; gap: 10px; z-index: 40; align-items: flex-end; }
.pd-fab-menu-item { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); border-radius: 30px; padding: 8px 8px 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
.pd-fab-menu-item .pd-fab-mini { width: 32px; height: 32px; border-radius: 50%; background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; }

/* ---- inputs ---- */
.pd-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.pd-field label { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.pd-field .pd-hint { font-size: 11px; color: var(--muted); font-weight: 400; }
.pd-input, .pd-select, .pd-textarea {
  width: 100%; border: 1px solid var(--border); border-radius: 10px; padding: 9px 12px; font-size: 13.5px;
  font-family: inherit; background: var(--card); color: var(--ink); outline: none; transition: border-color 0.15s;
}
.pd-input:focus, .pd-select:focus, .pd-textarea:focus { border-color: var(--navy-light); box-shadow: 0 0 0 3px rgba(30,67,104,0.12); }
.pd-textarea { min-height: 90px; resize: vertical; line-height: 1.5; }
.pd-search-wrap { position: relative; }
.pd-search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted-2); }
.pd-search-wrap input { padding-left: 34px; }

.pd-chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
.pd-chip {
  padding: 7px 13px; border-radius: 20px; border: 1px solid var(--border); font-size: 12.5px; font-weight: 500;
  cursor: pointer; background: var(--card); color: var(--ink); transition: all 0.12s; user-select: none;
}
.pd-chip.selected { background: var(--navy); color: #fff; border-color: var(--navy); }

/* ---- badges ---- */
.pd-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
.pd-dot { width: 7px; height: 7px; border-radius: 50%; }

/* ---- tables ---- */
.pd-table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
.pd-table { width: 100%; border-collapse: collapse; font-size: 13px; background: var(--card); }
.pd-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); font-weight: 700; padding: 11px 14px; background: var(--navy-tint); border-bottom: 1px solid var(--border); white-space: nowrap; }
.pd-table td { padding: 11px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.pd-table tr:last-child td { border-bottom: none; }
.pd-table tr:hover td { background: var(--navy-tint); }

/* ---- schedule / attendance cards ---- */
.pd-class-card {
  background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px;
  box-shadow: var(--shadow-sm); transition: box-shadow 0.15s, transform 0.15s; cursor: pointer; position: relative; overflow: hidden;
}
.pd-class-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.pd-class-card .pd-accent-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--navy); }
.pd-class-card.done .pd-accent-bar { background: var(--success); }
.pd-class-card.progress .pd-accent-bar { background: var(--warning); }

.pd-student-row {
  display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--card); margin-bottom: 8px;
}
.pd-student-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--navy-tint); color: var(--navy); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.pd-status-btn { min-width: 92px; padding: 7px 10px; border-radius: 9px; border: none; font-weight: 700; font-size: 12px; cursor: pointer; text-align: center; transition: transform 0.1s; }
.pd-status-btn:active { transform: scale(0.96); }

/* ---- modal ---- */
.pd-modal-overlay { position: fixed; inset: 0; background: rgba(8,24,38,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; backdrop-filter: blur(2px); }
.pd-modal { background: var(--card); border-radius: 18px; width: 100%; max-width: 560px; max-height: 88vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.pd-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--card); z-index: 2; }
.pd-modal-title { font-size: 16px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
.pd-modal-body { padding: 20px 22px; }
.pd-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 22px; border-top: 1px solid var(--border); position: sticky; bottom: 0; background: var(--card); }

/* ---- toast ---- */
.pd-toast-wrap { position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 200; }
.pd-toast { background: var(--navy); color: #fff; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 10px; min-width: 220px; animation: pd-toast-in 0.2s ease; }
.pd-toast.success { background: var(--success); }
.pd-toast.error { background: var(--danger); }
@keyframes pd-toast-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

/* ---- empty state ---- */
.pd-empty { text-align: center; padding: 50px 20px; color: var(--muted); }
.pd-empty svg { margin-bottom: 12px; color: var(--muted-2); }
.pd-empty-title { font-weight: 700; color: var(--ink); font-size: 14.5px; margin-bottom: 5px; }

/* ---- skeleton ---- */
.pd-skel { background: linear-gradient(90deg, var(--border) 25%, var(--navy-tint) 50%, var(--border) 75%); background-size: 200% 100%; animation: pd-shimmer 1.4s infinite; border-radius: 8px; }
@keyframes pd-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ---- bottom nav (mobile) ---- */
.pd-bottom-nav { display: none; }

/* ---- misc ---- */
.pd-flex-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pd-tabs { display: flex; gap: 4px; background: var(--navy-tint); padding: 4px; border-radius: 12px; width: fit-content; }
.pd-tab { padding: 8px 16px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--muted); border: none; background: transparent; }
.pd-tab.active { background: var(--card); color: var(--navy); box-shadow: var(--shadow-sm); }
.pd-pill { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: var(--navy-tint); color: var(--navy); }
.pd-link { color: var(--navy); font-weight: 600; cursor: pointer; text-decoration: none; }
.pd-link:hover { text-decoration: underline; }
.pd-divider { height: 1px; background: var(--border); margin: 16px 0; }
.pd-kbd { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; background: var(--navy-tint); color: var(--navy); padding: 2px 6px; border-radius: 5px; border: 1px solid var(--border); }

.pd-progress-track { height: 8px; border-radius: 20px; background: var(--navy-tint); overflow: hidden; }
.pd-progress-fill { height: 100%; border-radius: 20px; background: var(--red); transition: width 0.4s ease; }

@media (max-width: 980px) {
  .pd-grid-2 { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .pd-sidebar { position: fixed; left: -280px; top: 0; z-index: 90; transition: left 0.2s ease; box-shadow: var(--shadow-lg); }
  .pd-sidebar.open { left: 0; }
  .pd-menu-btn { display: flex; }
  .pd-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 80; }
  .pd-content { padding: 18px 14px 90px; }
  .pd-topbar { padding: 0 14px; }
  .pd-bottom-nav {
    display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: 62px; background: var(--card);
    border-top: 1px solid var(--border); z-index: 60; justify-content: space-around; align-items: center; padding: 0 4px;
  }
  .pd-bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 9.5px; font-weight: 600; color: var(--muted); background: none; border: none; cursor: pointer; padding: 6px; flex: 1; }
  .pd-bottom-nav-item.active { color: var(--red); }
  .pd-fab { bottom: 78px; right: 16px; }
  .pd-fab-menu { bottom: 144px; right: 16px; }
}

@media print {
  .pd-sidebar, .pd-topbar, .pd-bottom-nav, .pd-fab, .no-print { display: none !important; }
  .pd-content { padding: 0; }
  body, .pd-root { background: #fff !important; }
}
`;

/* ============================================================
   small reusable components
   ============================================================ */

export { GLOBAL_CSS };
