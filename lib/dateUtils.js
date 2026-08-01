/**
 * Date, time-period, and calendar-label helpers.
 * Pure functions — no React, no app state.
 */

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const MONTH_NAMES = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];


const PERIOD_TIMES = [
  ["07:00","07:45"], ["07:45","08:30"], ["08:30","09:15"], ["09:15","10:00"],
  ["10:15","11:00"], ["11:00","11:45"], ["12:30","13:15"], ["13:15","14:00"],
  ["14:00","14:45"], ["14:45","15:30"],
];


function pad2(n) { return String(n).padStart(2, "0"); }

function toISODate(d) {
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

function todayISO() { return toISODate(new Date()); }

function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatLongDate(iso) {
  const d = parseISO(iso);
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  return days[d.getDay()] + ", " + d.getDate() + " " + MONTH_NAMES[d.getMonth()] + " " + d.getFullYear();
}

function formatShortDate(iso) {
  const d = parseISO(iso);
  return d.getDate() + " " + MONTH_NAMES[d.getMonth()].slice(0,3) + " " + d.getFullYear();
}

function dayNameFromISO(iso) {
  return DAY_NAMES[parseISO(iso).getDay()];
}

function periodRangeLabel(periods) {
  const first = periods[0], last = periods[periods.length - 1];
  return PERIOD_TIMES[first - 1][0] + " - " + PERIOD_TIMES[last - 1][1];
}

function periodLabel(periods) {
  return periods.length > 1 ? (periods[0] + "-" + periods[periods.length-1]) : String(periods[0]);
}

function sessionKey(classId, dateISO) { return classId + "__" + dateISO; }

function isoWeekRange(iso) {
  const d = parseISO(iso);
  const day = (d.getDay() + 6) % 7; // Monday=0
  const monday = new Date(d); monday.setDate(d.getDate() - day);
  const friday = new Date(monday); friday.setDate(monday.getDate() + 4);
  return [toISODate(monday), toISODate(friday)];
}

export {
  DAY_NAMES, DAY_ORDER, MONTH_NAMES, PERIOD_TIMES,
  pad2, toISODate, todayISO, parseISO, formatLongDate, formatShortDate,
  dayNameFromISO, periodRangeLabel, periodLabel, sessionKey, isoWeekRange,
};
