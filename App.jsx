import React, { useState, useEffect, useCallback, useRef } from "react";
import { CalendarCheck, UserPlus, PenLine, X, Plus } from "lucide-react";

import { GLOBAL_CSS } from "./styles/globalStyles";
import { buildInitialDB } from "./data/seedData";
import { uid, deepClone } from "./lib/idUtils";
import { todayISO, dayNameFromISO } from "./lib/dateUtils";
import { scheduleForDay, sessionStatusFor } from "./lib/aggregations";
import { loadDB, saveDB } from "./lib/storage";

import { ToastStack, ErrorBoundary } from "./components/common";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import BottomNav from "./components/layout/BottomNav";

import Dashboard from "./features/dashboard/Dashboard";
import ScheduleView from "./features/schedule/ScheduleView";
import ClassesView from "./features/classes/ClassesView";
import StudentsView from "./features/students/StudentsView";
import StudentProfile from "./features/students/StudentProfile";
import AttendanceHome from "./features/attendance/AttendanceHome";
import AttendanceSession from "./features/attendance/AttendanceSession";
import JournalView from "./features/journal/JournalView";
import ReportsView from "./features/reports/ReportsView";
import SettingsView from "./features/settings/SettingsView";

export default function PresensiDeutschApp() {
  const [db, setDb] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);

  // sub-routes
  const [attRoute, setAttRoute] = useState(null); // { classId, date } or null = list
  const [journalPrefill, setJournalPrefill] = useState(null);
  const [studentsInitialClass, setStudentsInitialClass] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [studentModalTrigger, setStudentModalTrigger] = useState(0);

  const saveTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadDB();
      if (cancelled) return;
      setDb(stored || buildInitialDB());
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded || !db) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { saveDB(db); }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [db, loaded]);

  const toast = useCallback((message, type) => {
    const id = uid("toast");
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const mutate = useCallback((fn) => {
    setDb(prev => {
      const draft = deepClone(prev);
      const result = fn(draft);
      return result || draft;
    });
  }, []);

  function goAttendance(classId, date) {
    setView("attendance");
    setAttRoute({ classId, date });
  }
  function goJournal(classId, date) {
    setView("journal");
    setJournalPrefill({ classId, dateISO: date });
  }
  function openClassStudents(classId) {
    setView("students");
    setStudentsInitialClass(classId);
    setProfileId(null);
  }
  function openProfile(studentId) {
    setProfileId(studentId);
  }

  /**
   * Top-level nav (Sidebar + BottomNav) used to each inline their own copy
   * of "reset every sub-route when switching sections" — audit finding H6.
   * Centralized here so there's one place that defines what "navigate to
   * a top-level section" means.
   */
  function navigate(nextView) {
    setView(nextView);
    setAttRoute(null);
    setProfileId(null);
  }

  function quickAttendance() {
    if (!db) return;
    const today = todayISO();
    const dayName = dayNameFromISO(today);
    const daySchedule = scheduleForDay(db, dayName);
    const next = daySchedule.find(sch => sessionStatusFor(db, sch.classId, today) !== "DONE");
    if (next) goAttendance(next.classId, today);
    else { setView("attendance"); setAttRoute(null); }
  }

  function resetSeed() {
    mutate(() => buildInitialDB());
    toast("Data contoh berhasil dimuat ulang", "success");
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") { setFabOpen(false); setMobileOpen(false); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        quickAttendance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [db]);

  if (!loaded || !db) {
    return (
      <div className="pd-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 420 }}>
        <style>{GLOBAL_CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div className="pd-skel" style={{ width: 64, height: 64, borderRadius: 16, margin: "0 auto 14px" }} />
          <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>Memuat Presensi Deutsch...</div>
        </div>
      </div>
    );
  }

  let content;
  if (view === "dashboard") content = <Dashboard db={db} goAttendance={goAttendance} setView={setView} />;
  else if (view === "schedule") content = <ScheduleView db={db} mutate={mutate} toast={toast} />;
  else if (view === "classes") content = <ClassesView db={db} mutate={mutate} toast={toast} openClassStudents={openClassStudents} />;
  else if (view === "students") {
    content = profileId
      ? <StudentProfile db={db} studentId={profileId} onBack={() => setProfileId(null)} />
      : <StudentsView db={db} mutate={mutate} toast={toast} initialClassId={studentsInitialClass} openProfile={openProfile} key={studentModalTrigger} />;
  }
  else if (view === "attendance") {
    content = attRoute
      ? <AttendanceSession db={db} mutate={mutate} toast={toast} classId={attRoute.classId} dateISO={attRoute.date}
          onBack={() => setAttRoute(null)} goJournal={goJournal} />
      : <AttendanceHome db={db} goSession={(cid, date) => setAttRoute({ classId: cid, date })} />;
  }
  else if (view === "journal") content = <JournalView db={db} mutate={mutate} toast={toast} prefill={journalPrefill} clearPrefill={() => setJournalPrefill(null)} />;
  else if (view === "reports") content = <ReportsView db={db} />;
  else if (view === "settings") content = <SettingsView db={db} mutate={mutate} toast={toast} onResetSeed={resetSeed} />;

  const themeClass = db.settings.theme === "dark" ? "dark" : "";

  return (
    <div className={"pd-root " + themeClass}>
      <style>{GLOBAL_CSS}</style>
      <div className="pd-shell">
        <Sidebar view={view} setView={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} settings={db.settings} />
        <div className="pd-main">
          <TopBar view={view} setMobileOpen={setMobileOpen} onQuickAttendance={quickAttendance} />
          <div className="pd-content">
            {/* Audit finding H4: a broken screen no longer white-screens the whole app. */}
            <ErrorBoundary label={view} onReset={() => navigate("dashboard")}>
              {content}
            </ErrorBoundary>
          </div>
        </div>
      </div>

      <BottomNav view={view} setView={navigate} />

      {fabOpen && (
        <div className="pd-fab-menu no-print">
          <div className="pd-fab-menu-item" onClick={() => { setFabOpen(false); quickAttendance(); }}>
            Presensi Baru <span className="pd-fab-mini"><CalendarCheck size={15} /></span>
          </div>
          <div className="pd-fab-menu-item" onClick={() => { setFabOpen(false); setView("students"); setProfileId(null); setStudentsInitialClass(null); setStudentModalTrigger(x => x + 1); }}>
            Tambah Siswa <span className="pd-fab-mini"><UserPlus size={15} /></span>
          </div>
          <div className="pd-fab-menu-item" onClick={() => { setFabOpen(false); setView("journal"); setJournalPrefill({ classId: db.classes[0].id, dateISO: todayISO() }); }}>
            Jurnal Baru <span className="pd-fab-mini"><PenLine size={15} /></span>
          </div>
        </div>
      )}
      <button className="pd-fab no-print" onClick={() => setFabOpen(o => !o)} title="Aksi Cepat">
        {fabOpen ? <X size={22} /> : <Plus size={24} />}
      </button>

      <ToastStack toasts={toasts} />
    </div>
  );
}
