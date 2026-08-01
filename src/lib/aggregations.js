/**
 * Business/domain logic: derived reads over the app's data (db) —
 * lookups, session queries, attendance-rate math, and alert rules.
 * Pure functions — no React, no JSX, no side effects except logActivity
 * (which mutates a draft object handed to it, matching how it's used
 * inside mutate() call sites).
 */
import { sessionKey, pad2 } from "./dateUtils";
import { uid } from "./idUtils";

function getClassStudents(db, classId) {
  return db.students.filter(s => s.classId === classId && !s.archived);
}

function getSession(db, classId, dateISO) {
  return db.attendance[sessionKey(classId, dateISO)] || null;
}

function nextMeetingNumber(db, classId) {
  return (db.meetingCounters[classId] || 0) + 1;
}

function scheduleForDay(db, dayName) {
  return db.schedule.filter(s => s.day === dayName).sort((a,b) => a.periods[0]-b.periods[0]);
}

function classById(db, id) { return db.classes.find(c => c.id === id); }
function studentById(db, id) { return db.students.find(s => s.id === id); }

// all attendance sessions for a class, sorted by date
function sessionsForClass(db, classId) {
  return Object.values(db.attendance)
    .filter(s => s.classId === classId)
    .sort((a,b) => a.date.localeCompare(b.date));
}

// all sessions within [startISO, endISO] inclusive, optionally filtered by class
function sessionsInRange(db, startISO, endISO, classId) {
  return Object.values(db.attendance).filter(s => {
    if (classId && s.classId !== classId) return false;
    return s.date >= startISO && s.date <= endISO;
  }).sort((a,b) => a.date.localeCompare(b.date));
}

function sessionsOnDate(db, dateISO) {
  return Object.values(db.attendance).filter(s => s.date === dateISO);
}

function summarizeRecords(records) {
  const out = { PRESENT:0, EXCUSED:0, SICK:0, ABSENT:0, DUTY:0, NOT_SET:0, total:0 };
  Object.values(records || {}).forEach(r => {
    const st = r.status || "NOT_SET";
    out[st] = (out[st]||0) + 1;
    out.total++;
  });
  return out;
}

function attendanceRate(summary) {
  const counted = summary.total - summary.NOT_SET;
  if (counted <= 0) return null;
  return Math.round((summary.PRESENT / counted) * 1000) / 10;
}

// month-to-date attendance rate across all classes
function monthlyOverallRate(db, year, month) {
  const prefix = year + "-" + pad2(month + 1);
  const sessions = Object.values(db.attendance).filter(s => s.date.startsWith(prefix));
  let present = 0, counted = 0;
  sessions.forEach(s => {
    const sum = summarizeRecords(s.records);
    present += sum.PRESENT;
    counted += (sum.total - sum.NOT_SET);
  });
  if (counted === 0) return null;
  return Math.round((present / counted) * 1000) / 10;
}

// per-student stats across a list of sessions
function studentStatsAcrossSessions(sessions, studentId) {
  const out = { PRESENT:0, EXCUSED:0, SICK:0, ABSENT:0, DUTY:0, total:0 };
  sessions.forEach(s => {
    const r = s.records[studentId];
    if (r && r.status && r.status !== "NOT_SET") {
      out[r.status] = (out[r.status]||0) + 1;
      out.total++;
    }
  });
  return out;
}

// students with attendance alerts: 3+ consecutive absence-type or overall rate < 80%
function computeAlerts(db) {
  const alerts = [];
  db.classes.filter(c => !c.archived).forEach(cls => {
    const sessions = sessionsForClass(db, cls.id);
    const students = getClassStudents(db, cls.id);
    students.forEach(stu => {
      const stats = studentStatsAcrossSessions(sessions, stu.id);
      if (stats.total >= 3) {
        const rate = Math.round((stats.PRESENT / stats.total) * 1000) / 10;
        if (rate < 80) {
          alerts.push({ type: "LOW_RATE", studentId: stu.id, studentName: stu.name, classId: cls.id, className: cls.name, rate });
        }
      }
      // consecutive non-present in last 3 sessions with a set status
      const relevant = sessions.filter(s => s.records[stu.id] && s.records[stu.id].status && s.records[stu.id].status !== "NOT_SET");
      const lastThree = relevant.slice(-3);
      if (lastThree.length === 3 && lastThree.every(s => s.records[stu.id].status === "ABSENT")) {
        alerts.push({ type: "CONSECUTIVE_ABSENT", studentId: stu.id, studentName: stu.name, classId: cls.id, className: cls.name });
      }
      const sickCount = relevant.filter(s => s.records[stu.id].status === "SICK").length;
      if (relevant.length >= 4 && sickCount / relevant.length >= 0.4) {
        alerts.push({ type: "FREQUENT_SICK", studentId: stu.id, studentName: stu.name, classId: cls.id, className: cls.name, sickCount });
      }
    });
  });
  return alerts;
}

function logActivity(db, message, icon) {
  db.activityLog = [{ id: uid("act"), message, icon: icon || "info", at: new Date().toISOString() }, ...db.activityLog].slice(0, 30);
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return min + " menit lalu";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + " jam lalu";
  const day = Math.floor(hr / 24);
  return day + " hari lalu";
}

function sessionStatusFor(db, classId, dateISO) {
  const s = getSession(db, classId, dateISO);
  if (!s) return "NOT_STARTED";
  const total = Object.keys(s.records).length;
  const filled = Object.values(s.records).filter(r => r.status && r.status !== "NOT_SET").length;
  if (filled === 0) return "NOT_STARTED";
  if (filled < total) return "IN_PROGRESS";
  return "DONE";
}

export {
  getClassStudents, getSession, nextMeetingNumber, scheduleForDay,
  classById, studentById, sessionsForClass, sessionsInRange, sessionsOnDate,
  summarizeRecords, attendanceRate, monthlyOverallRate, studentStatsAcrossSessions,
  computeAlerts, logActivity, timeAgo, sessionStatusFor,
};
