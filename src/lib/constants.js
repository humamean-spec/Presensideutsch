import {
  LayoutDashboard, CalendarCheck, BookOpen, BarChart3, Users, School,
  CalendarDays, Settings as SettingsIcon,
} from "lucide-react";

/**
 * Static reference data: attendance status metadata, form option lists,
 * and top-level navigation configuration.
 */

const STATUS_ORDER = ["NOT_SET", "PRESENT", "EXCUSED", "SICK", "ABSENT", "DUTY"];

const STATUS_META = {
  NOT_SET:  { label: "Belum Diisi", short: "-",  color: "#94A3B8", bg: "#F1F5F9" },
  PRESENT:  { label: "Hadir",       short: "H",  color: "#16A34A", bg: "#DCFCE7" },
  EXCUSED:  { label: "Izin",        short: "I",  color: "#2563EB", bg: "#DBEAFE" },
  SICK:     { label: "Sakit",       short: "S",  color: "#F97316", bg: "#FFEDD5" },
  ABSENT:   { label: "Alpa",        short: "A",  color: "#DC2626", bg: "#FEE2E2" },
  DUTY:     { label: "Tugas Sekolah", short: "T", color: "#7C3AED", bg: "#EDE9FE" },
};

const REASON_PRESETS = [
  "Sakit dengan surat dokter", "Izin keperluan keluarga", "Mengikuti lomba/kompetisi",
  "Surat izin orang tua", "Terlambat masuk", "Kegiatan sekolah", "Tanpa keterangan",
];

const TEACHING_METHODS = ["Ceramah","Diskusi","Presentasi","Kerja Berpasangan","Kerja Kelompok","Permainan/Game","Kuis","Video","Proyek","Bermain Peran","Lembar Kerja","Lainnya"];
const LEARNING_MEDIA = ["PowerPoint","NotebookLM","YouTube","Buku Paket","Lembar Kerja","AI Chatbot","Canva","Google Slides","Lainnya"];
const ASSESSMENT_TYPES = ["Observasi","Kuis","Presentasi","Penugasan","Unjuk Kerja","Lembar Kerja"];

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "attendance", label: "Presensi", icon: CalendarCheck },
  { key: "journal", label: "Jurnal Mengajar", icon: BookOpen },
  { key: "reports", label: "Laporan", icon: BarChart3 },
  { key: "students", label: "Siswa", icon: Users },
  { key: "classes", label: "Kelas", icon: School },
  { key: "schedule", label: "Jadwal", icon: CalendarDays },
  { key: "settings", label: "Pengaturan", icon: SettingsIcon },
];

const BOTTOM_NAV_KEYS = ["dashboard", "attendance", "journal", "reports", "students"];

export {
  STATUS_ORDER, STATUS_META, REASON_PRESETS, TEACHING_METHODS,
  LEARNING_MEDIA, ASSESSMENT_TYPES, NAV_ITEMS, BOTTOM_NAV_KEYS,
};
