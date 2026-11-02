import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Gauge,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type HrView = "overview" | "employees" | "attendance" | "schedule" | "leave" | "payroll" | "reports";
type EmployeeStatus = "Aktif" | "Cuti" | "Nonaktif";
type EmploymentType = "Tetap" | "Kontrak" | "Paruh waktu";
type AttendanceStatus = "Hadir" | "Terlambat" | "Izin" | "Absen";
type LeaveStatus = "Menunggu" | "Disetujui" | "Ditolak";
type Department = "Operasional" | "Kasir" | "Dapur" | "Marketing" | "Manajemen";

type Employee = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: Department;
  employment: EmploymentType;
  status: EmployeeStatus;
  shift: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  salary: number;
  attendance: number;
  leaveBalance: number;
  tone: string;
};

type AttendanceRecord = {
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: AttendanceStatus;
  note: string;
};

type LeaveRequest = {
  id: string;
  employeeId: string;
  type: "Cuti tahunan" | "Izin pribadi" | "Sakit";
  start: string;
  end: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submitted: string;
};

const navItems: Array<{ id: HrView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan HR", icon: LayoutDashboard },
  { id: "employees", label: "Anggota tim", icon: Users },
  { id: "attendance", label: "Absensi", icon: CalendarCheck },
  { id: "schedule", label: "Jadwal kerja", icon: CalendarDays },
  { id: "leave", label: "Cuti & izin", icon: CalendarRange },
  { id: "payroll", label: "Payroll", icon: WalletCards },
  { id: "reports", label: "Laporan HR", icon: BarChart3 },
];

const departments: Array<"Semua" | Department> = ["Semua", "Operasional", "Kasir", "Dapur", "Marketing", "Manajemen"];

const initialEmployees: Employee[] = [
  {
    id: "employee-01",
    name: "Nadia Putri",
    initials: "NP",
    role: "Store Manager",
    department: "Manajemen",
    employment: "Tetap",
    status: "Aktif",
    shift: "09:00–18:00",
    email: "nadia.putri@kopinempo.id",
    phone: "0812 4490 1288",
    location: "Kopi Nempo · Garut",
    joinDate: "12 Jan 2024",
    salary: 8600000,
    attendance: 98,
    leaveBalance: 10,
    tone: "bg-[#d7efeb] text-[#0f766e]",
  },
  {
    id: "employee-02",
    name: "Rizky Maulana",
    initials: "RM",
    role: "Head Barista",
    department: "Kasir",
    employment: "Tetap",
    status: "Aktif",
    shift: "07:00–16:00",
    email: "rizky.maulana@kopinempo.id",
    phone: "0813 7712 9044",
    location: "Kopi Nempo · Garut",
    joinDate: "04 Mar 2024",
    salary: 6200000,
    attendance: 96,
    leaveBalance: 8,
    tone: "bg-[#dce9f7] text-[#3a6b9b]",
  },
  {
    id: "employee-03",
    name: "Siti Rahma",
    initials: "SR",
    role: "Kitchen Lead",
    department: "Dapur",
    employment: "Tetap",
    status: "Aktif",
    shift: "08:00–17:00",
    email: "siti.rahma@kopinempo.id",
    phone: "0812 6631 2201",
    location: "Kopi Nempo · Garut",
    joinDate: "18 Jun 2024",
    salary: 5800000,
    attendance: 94,
    leaveBalance: 6,
    tone: "bg-[#e8e3f5] text-[#7362a6]",
  },
  {
    id: "employee-04",
    name: "Fajar Hidayat",
    initials: "FH",
    role: "Kasir",
    department: "Kasir",
    employment: "Kontrak",
    status: "Aktif",
    shift: "12:00–21:00",
    email: "fajar.hidayat@kopinempo.id",
    phone: "0821 9055 1707",
    location: "Kopi Nempo · Garut",
    joinDate: "02 Sep 2025",
    salary: 4500000,
    attendance: 91,
    leaveBalance: 4,
    tone: "bg-[#f8e8cf] text-[#a56c2b]",
  },
  {
    id: "employee-05",
    name: "Maya Salsabila",
    initials: "MS",
    role: "Marketing Specialist",
    department: "Marketing",
    employment: "Tetap",
    status: "Aktif",
    shift: "09:00–18:00",
    email: "maya.salsabila@kopinempo.id",
    phone: "0812 1098 7765",
    location: "Hybrid · Garut",
    joinDate: "20 Feb 2025",
    salary: 6800000,
    attendance: 97,
    leaveBalance: 12,
    tone: "bg-[#e2f0e2] text-[#4d865c]",
  },
  {
    id: "employee-06",
    name: "Asep Kurnia",
    initials: "AK",
    role: "Kitchen Crew",
    department: "Dapur",
    employment: "Paruh waktu",
    status: "Cuti",
    shift: "10:00–16:00",
    email: "asep.kurnia@kopinempo.id",
    phone: "0819 3302 8111",
    location: "Kopi Nempo · Garut",
    joinDate: "11 Nov 2025",
    salary: 3200000,
    attendance: 89,
    leaveBalance: 2,
    tone: "bg-[#f3e2df] text-[#aa6359]",
  },
  {
    id: "employee-07",
    name: "Dewi Anggraini",
    initials: "DA",
    role: "Operations Admin",
    department: "Operasional",
    employment: "Kontrak",
    status: "Aktif",
    shift: "09:00–18:00",
    email: "dewi.anggraini@kopinempo.id",
    phone: "0813 9902 7118",
    location: "Kopi Nempo · Garut",
    joinDate: "08 Apr 2025",
    salary: 4900000,
    attendance: 95,
    leaveBalance: 7,
    tone: "bg-[#e9edf0] text-[#6f8288]",
  },
];

const initialAttendance: AttendanceRecord[] = [
  { employeeId: "employee-01", date: "18 Sep 2026", clockIn: "08:52", clockOut: "18:07", status: "Hadir", note: "Tepat waktu" },
  { employeeId: "employee-02", date: "18 Sep 2026", clockIn: "07:06", clockOut: "16:03", status: "Terlambat", note: "Terlambat 6 menit" },
  { employeeId: "employee-03", date: "18 Sep 2026", clockIn: "07:58", clockOut: "17:04", status: "Hadir", note: "Tepat waktu" },
  { employeeId: "employee-04", date: "18 Sep 2026", clockIn: "—", clockOut: "—", status: "Izin", note: "Keperluan keluarga" },
  { employeeId: "employee-05", date: "18 Sep 2026", clockIn: "08:47", clockOut: "18:01", status: "Hadir", note: "Tepat waktu" },
  { employeeId: "employee-06", date: "18 Sep 2026", clockIn: "—", clockOut: "—", status: "Absen", note: "Sedang cuti" },
  { employeeId: "employee-07", date: "18 Sep 2026", clockIn: "09:02", clockOut: "18:00", status: "Terlambat", note: "Terlambat 2 menit" },
];

const initialLeaves: LeaveRequest[] = [
  { id: "leave-01", employeeId: "employee-04", type: "Izin pribadi", start: "18 Sep 2026", end: "18 Sep 2026", days: 1, reason: "Keperluan keluarga", status: "Menunggu", submitted: "Hari ini, 07:14" },
  { id: "leave-02", employeeId: "employee-06", type: "Cuti tahunan", start: "18 Sep 2026", end: "20 Sep 2026", days: 3, reason: "Pulang kampung", status: "Disetujui", submitted: "16 Sep 2026" },
  { id: "leave-03", employeeId: "employee-05", type: "Cuti tahunan", start: "28 Sep 2026", end: "30 Sep 2026", days: 3, reason: "Libur keluarga", status: "Menunggu", submitted: "17 Sep 2026" },
  { id: "leave-04", employeeId: "employee-02", type: "Sakit", start: "10 Sep 2026", end: "10 Sep 2026", days: 1, reason: "Pemulihan kesehatan", status: "Disetujui", submitted: "10 Sep 2026" },
];

const HR_PREVIEW_PASSWORD = "nemposukses";
const HR_PREVIEW_ACCESS_KEY = "nempo_hr_preview_access";
const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
const compactRupiah = (value: number) => `Rp${(value / 1000000).toFixed(1).replace(".", ",")} jt`;

function HrPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Human Resource" description="Masukkan password untuk membuka preview pengelolaan tim, absensi, jadwal kerja, cuti, dan payroll." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === HR_PREVIEW_PASSWORD) {
      localStorage.setItem(HR_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-hr-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><Users className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Human Resource</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview pengelolaan tim, absensi, jadwal kerja, cuti, dan payroll.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="hr-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Human Resource</span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} placeholder="Masukkan password" autoComplete="current-password" autoFocus className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9db5b5]" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#7da5a2] hover:text-[#0f766e]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b75c54]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white transition-colors hover:bg-[#0b625c]">Masuk ke preview</button>
        </form>
        <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><Sparkles className="h-3.5 w-3.5 text-[#0f9b8e]" /> Demo data untuk presentasi customer.</p>
      </div>
    </main>
  );
}

export default function DigitalHumanResourceDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <HrPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <HrWorkspace />;
}

function HrWorkspace() {
  const [activeView, setActiveView] = useState<HrView>("overview");
  const [employees, setEmployees] = useState(initialEmployees);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<"Semua" | Department>("Semua");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeModal, setEmployeeModal] = useState<Employee | "new" | null>(null);
  const [leaveModal, setLeaveModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetDemo() {
    setActiveView("overview");
    setEmployees(initialEmployees);
    setAttendance(initialAttendance);
    setLeaves(initialLeaves);
    setQuery("");
    setDepartment("Semua");
    setSelectedEmployee(null);
    setEmployeeModal(null);
    setLeaveModal(false);
    notify("Demo HR dikembalikan ke data awal.");
  }

  function saveEmployee(employee: Employee) {
    setEmployees((current) => current.some((entry) => entry.id === employee.id)
      ? current.map((entry) => entry.id === employee.id ? employee : entry)
      : [employee, ...current]);
    setEmployeeModal(null);
    setSelectedEmployee(employee);
    notify(`${employee.name} berhasil disimpan.`);
  }

  function updateEmployeeStatus(employeeId: string, status: EmployeeStatus) {
    setEmployees((current) => current.map((employee) => employee.id === employeeId ? { ...employee, status } : employee));
    setSelectedEmployee((current) => current?.id === employeeId ? { ...current, status } : current);
    notify("Status anggota tim diperbarui.");
  }

  function markAttendance(employeeId: string, status: AttendanceStatus) {
    setAttendance((current) => current.map((record) => record.employeeId === employeeId ? {
      ...record,
      status,
      clockIn: status === "Hadir" ? "09:00" : record.clockIn,
      note: status === "Hadir" ? "Ditandai dari workspace HR" : record.note,
    } : record));
    notify("Status absensi berhasil diperbarui.");
  }

  function updateLeave(leaveId: string, status: LeaveStatus) {
    setLeaves((current) => current.map((leave) => leave.id === leaveId ? { ...leave, status } : leave));
    notify(status === "Disetujui" ? "Pengajuan cuti disetujui." : "Pengajuan cuti ditolak.");
  }

  function addLeave(leave: LeaveRequest) {
    setLeaves((current) => [leave, ...current]);
    setLeaveModal(false);
    notify("Pengajuan cuti baru berhasil dibuat.");
  }

  function exportCsv(filename: string, rows: Array<Array<string | number>>) {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filename}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Laporan berhasil diekspor.");
  }

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesQuery = !normalizedQuery || [employee.name, employee.role, employee.department, employee.email].join(" ").toLowerCase().includes(normalizedQuery);
      return matchesQuery && (department === "Semua" || employee.department === department);
    });
  }, [department, employees, query]);
  const activeEmployees = employees.filter((employee) => employee.status !== "Nonaktif");
  const pendingLeaves = leaves.filter((leave) => leave.status === "Menunggu");
  const presentCount = attendance.filter((record) => record.status === "Hadir" || record.status === "Terlambat").length;
  const payrollTotal = activeEmployees.reduce((total, employee) => total + employee.salary, 0);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan HR";

  return (
    <Layout>
      <SEO title="Human Resource Demo — Digi Nempo" description="Demo Human Resource Digi Nempo untuk mengelola anggota tim, absensi, jadwal kerja, cuti, payroll, dan laporan." keywords="Human Resource, HRIS, absensi, payroll, jadwal kerja, cuti, Digi Nempo" path="/digital-services/human-resource" />
      <main className="nempo-demo-green nempo-hr-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=human-resource" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[232px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><Users className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo People OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">People operations</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "leave" && pendingLeaves.length > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{pendingLeaves.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Data tim terhubung dengan jadwal, payroll, operasional, dan Business OS.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/dapur-stock" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Operasional <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · People operations</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Kelola tim, jadwal, kehadiran, dan administrasi kerja dari satu workspace.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("attendance")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><CalendarCheck className="h-3.5 w-3.5" /> Absensi hari ini</button><button type="button" onClick={() => setEmployeeModal("new")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah anggota</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <HrOverview employees={employees} attendance={attendance} leaves={leaves} payrollTotal={payrollTotal} presentCount={presentCount} onView={setActiveView} onEmployee={setSelectedEmployee} onNotify={notify} />}
                  {activeView === "employees" && <EmployeesView employees={filteredEmployees} query={query} setQuery={setQuery} department={department} setDepartment={setDepartment} onAdd={() => setEmployeeModal("new")} onEmployee={setSelectedEmployee} onEdit={(employee) => setEmployeeModal(employee)} onExport={() => exportCsv("nempo-data-anggota", [["Nama", "Jabatan", "Departemen", "Status", "Tipe", "Gaji"], ...employees.map((employee) => [employee.name, employee.role, employee.department, employee.status, employee.employment, employee.salary])])} />}
                  {activeView === "attendance" && <AttendanceView employees={employees} records={attendance} onMark={markAttendance} />}
                  {activeView === "schedule" && <ScheduleView employees={employees} onNotify={notify} />}
                  {activeView === "leave" && <LeaveView employees={employees} leaves={leaves} onAdd={() => setLeaveModal(true)} onUpdate={updateLeave} />}
                  {activeView === "payroll" && <PayrollView employees={activeEmployees} total={payrollTotal} onExport={() => exportCsv("nempo-payroll-september-2026", [["Nama", "Jabatan", "Departemen", "Gaji pokok", "Status"], ...activeEmployees.map((employee) => [employee.name, employee.role, employee.department, employee.salary, "Siap diproses"])])} />}
                  {activeView === "reports" && <ReportsView employees={employees} attendance={attendance} leaves={leaves} payrollTotal={payrollTotal} onExport={() => exportCsv("nempo-laporan-hr", [["Metrik", "Nilai"], ["Total anggota", employees.length], ["Kehadiran hari ini", `${presentCount}/${activeEmployees.length}`], ["Pengajuan cuti menunggu", pendingLeaves.length], ["Estimasi payroll", payrollTotal]])} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Terakhir diperbarui beberapa detik lalu</span></div>
        </div>
        {employeeModal && <EmployeeModal employee={employeeModal === "new" ? null : employeeModal} onClose={() => setEmployeeModal(null)} onSubmit={saveEmployee} />}
        {leaveModal && <LeaveModal employees={employees} onClose={() => setLeaveModal(false)} onSubmit={addLeave} />}
        {selectedEmployee && <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} onEdit={() => setEmployeeModal(selectedEmployee)} onStatus={(status) => updateEmployeeStatus(selectedEmployee.id, status)} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function HrOverview({ employees, attendance, leaves, payrollTotal, presentCount, onView, onEmployee, onNotify }: { employees: Employee[]; attendance: AttendanceRecord[]; leaves: LeaveRequest[]; payrollTotal: number; presentCount: number; onView: (view: HrView) => void; onEmployee: (employee: Employee) => void; onNotify: (message: string) => void }) {
  const activeEmployees = employees.filter((employee) => employee.status !== "Nonaktif");
  const pendingLeaves = leaves.filter((leave) => leave.status === "Menunggu");
  const attendanceRate = activeEmployees.length ? Math.round((presentCount / activeEmployees.length) * 100) : 0;
  const departmentsCount = new Set(activeEmployees.map((employee) => employee.department)).size;
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={Users} label="Anggota aktif" value={`${activeEmployees.length} orang`} detail={`${departmentsCount} departemen aktif`} tone="teal" />
      <MetricCard icon={UserCheck} label="Hadir hari ini" value={`${presentCount}/${activeEmployees.length}`} detail={`${attendanceRate}% kehadiran`} tone="blue" />
      <MetricCard icon={CalendarRange} label="Cuti menunggu" value={`${pendingLeaves.length} pengajuan`} detail={pendingLeaves.length ? "Perlu ditinjau hari ini" : "Semua sudah diproses"} tone="amber" />
      <MetricCard icon={CircleDollarSign} label="Estimasi payroll" value={compactRupiah(payrollTotal)} detail="Gaji pokok bulan ini" tone="violet" />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Team snapshot</p><h2 className="mt-2 text-lg font-black text-[#244950]">Tim tetap terpantau.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Lihat siapa yang hadir, siapa yang perlu ditindaklanjuti, dan kapasitas tim dalam satu pandangan.</p></div><Gauge className="h-5 w-5 text-[#0f766e]" /></div>
        <div className="mt-5 space-y-2">{employees.slice(0, 4).map((employee) => { const record = attendance.find((entry) => entry.employeeId === employee.id); return <button key={employee.id} type="button" onClick={() => onEmployee(employee)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className={`grid h-9 w-9 place-items-center rounded-full text-[10px] font-black ${employee.tone}`}>{employee.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{employee.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{employee.role} · {employee.department}</p></div><div className="text-right"><p className={`text-[10px] font-black ${record?.status === "Hadir" ? "text-[#0f766e]" : record?.status === "Terlambat" ? "text-[#b97820]" : "text-[#aa6359]"}`}>{record?.status ?? employee.status}</p><p className="mt-1 text-[9px] font-bold text-[#94a8aa]">{record?.clockIn !== "—" ? record?.clockIn : employee.shift}</p></div><ArrowRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>; })}</div>
      </section>
      <section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white">
        <div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">HR insight</p><h2 className="mt-2 text-lg font-black leading-tight">Tim yang rapi, operasional yang siap.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div>
        <p className="mt-3 text-[10px] leading-5 text-white/60">{pendingLeaves.length ? `${pendingLeaves.length} pengajuan cuti menunggu persetujuan. Tinjau hari ini agar jadwal shift tidak terganggu.` : "Semua pengajuan cuti sudah diproses. Jadwal tim siap digunakan."}</p>
        <div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Kehadiran</p><p className="mt-1 text-xl font-black">{attendanceRate}%</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Rata-rata hadir</p><p className="mt-1 text-xl font-black">{(activeEmployees.reduce((sum, employee) => sum + employee.attendance, 0) / Math.max(activeEmployees.length, 1)).toFixed(1)}%</p></div></div>
        <button type="button" onClick={() => pendingLeaves.length ? onView("leave") : onNotify("Ringkasan kesehatan tim siap dibagikan.")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">{pendingLeaves.length ? "Tinjau pengajuan cuti" : "Lihat ringkasan tim"} <ArrowRight className="h-3 w-3" /></button>
      </section>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <QuickAction icon={UserPlus} title="Tambah anggota" detail="Buat profil anggota tim baru" onClick={() => onView("employees")} />
      <QuickAction icon={CalendarDays} title="Atur jadwal" detail="Pastikan shift hari ini siap" onClick={() => onView("schedule")} />
      <QuickAction icon={FileSpreadsheet} title="Proses payroll" detail="Review gaji pokok bulan ini" onClick={() => onView("payroll")} />
    </div>
  </div>;
}

function EmployeesView({ employees, query, setQuery, department, setDepartment, onAdd, onEmployee, onEdit, onExport }: { employees: Employee[]; query: string; setQuery: (value: string) => void; department: "Semua" | Department; setDepartment: (value: "Semua" | Department) => void; onAdd: () => void; onEmployee: (employee: Employee) => void; onEdit: (employee: Employee) => void; onExport: () => void }) {
  return <div className="space-y-4">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="People directory" title="Anggota tim" description="Satu profil untuk jabatan, status kerja, shift, kontak, dan ringkasan kehadiran setiap anggota." /><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Anggota baru</button></div></div>
    <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, jabatan, atau email..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><div className="flex gap-1.5 overflow-x-auto">{departments.map((option) => <button key={option} type="button" onClick={() => setDepartment(option)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${department === option ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{option}</button>)}</div></div></div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{employees.map((employee) => <article key={employee.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><button type="button" onClick={() => onEmployee(employee)} className="flex items-center gap-3 text-left"><span className={`grid h-11 w-11 place-items-center rounded-full text-xs font-black ${employee.tone}`}>{employee.initials}</span><div><p className="text-xs font-black text-[#365b60]">{employee.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{employee.role}</p></div></button><StatusPill status={employee.status} /></div><div className="mt-5 grid grid-cols-2 gap-2"><MiniMetric label="Departemen" value={employee.department} /><MiniMetric label="Kehadiran" value={`${employee.attendance}%`} /><MiniMetric label="Shift" value={employee.shift} /><MiniMetric label="Sisa cuti" value={`${employee.leaveBalance} hari`} /></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#8aa1a3]"><MapPin className="h-3 w-3" /> {employee.location}</span><button type="button" onClick={() => onEdit(employee)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#e6f6f3]"><Pencil className="h-3 w-3" /> Edit</button></div></article>)}</div>
    {!employees.length && <EmptyState label="Anggota tim tidak ditemukan." />}
  </div>;
}

function AttendanceView({ employees, records, onMark }: { employees: Employee[]; records: AttendanceRecord[]; onMark: (employeeId: string, status: AttendanceStatus) => void }) {
  const statusCounts = ["Hadir", "Terlambat", "Izin", "Absen"].map((status) => ({ status: status as AttendanceStatus, count: records.filter((record) => record.status === status).length }));
  return <div className="space-y-4">
    <SectionIntro eyebrow="Daily attendance" title="Absensi hari ini" description="Pantau kehadiran dan jam masuk tim. Tandai status langsung dari workspace untuk melihat respons alurnya." />
    <div className="grid gap-3 sm:grid-cols-4">{statusCounts.map(({ status, count }) => <div key={status} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><p className={`text-[10px] font-black ${attendanceTone(status)}`}>{status}</p><p className="mt-2 text-2xl font-black text-[#183b43]">{count}</p><p className="mt-1 text-[9px] font-bold text-[#94a8aa]">anggota</p></div>)}</div>
    <div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-black text-[#244950]">Jumat, 18 September 2026</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Shift berjalan di Kopi Nempo · Garut</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e]"><span className="h-1.5 w-1.5 rounded-full bg-[#1db49f]" /> Live attendance</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Anggota</th><th className="pb-3">Jam masuk</th><th className="pb-3">Jam pulang</th><th className="pb-3">Status</th><th className="pb-3">Catatan</th><th className="pb-3" /></tr></thead><tbody className="divide-y divide-[#edf3f2]">{records.map((record) => { const employee = employees.find((entry) => entry.id === record.employeeId); if (!employee) return null; return <tr key={record.employeeId}><td className="py-3"><div className="flex items-center gap-2.5"><span className={`grid h-8 w-8 place-items-center rounded-full text-[9px] font-black ${employee.tone}`}>{employee.initials}</span><div><p className="text-[10px] font-black text-[#365b60]">{employee.name}</p><p className="mt-0.5 text-[9px] text-[#94a8aa]">{employee.role}</p></div></div></td><td className="py-3 text-[10px] font-black text-[#365b60]">{record.clockIn}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{record.clockOut}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[8px] font-black ${attendancePill(record.status)}`}>{record.status}</span></td><td className="py-3 text-[9px] font-semibold text-[#94a8aa]">{record.note}</td><td className="py-3 text-right">{record.status !== "Hadir" && <button type="button" onClick={() => onMark(record.employeeId, "Hadir")} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Tandai hadir</button>}</td></tr>; })}</tbody></table></div></div>
  </div>;
}

function ScheduleView({ employees, onNotify }: { employees: Employee[]; onNotify: (message: string) => void }) {
  const shifts = [
    { label: "Pagi", time: "07:00–16:00", color: "bg-[#e6f6f3] text-[#0f766e]", people: employees.filter((employee) => employee.shift.startsWith("07") || employee.shift.startsWith("08")) },
    { label: "Reguler", time: "09:00–18:00", color: "bg-[#e3eff8] text-[#3a6b9b]", people: employees.filter((employee) => employee.shift.startsWith("09")) },
    { label: "Sore", time: "10:00–19:00", color: "bg-[#ece9f8] text-[#7362a6]", people: employees.filter((employee) => employee.shift.startsWith("10") || employee.shift.startsWith("12")) },
  ];
  return <div className="space-y-4">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Shift planning" title="Jadwal kerja" description="Susun kebutuhan shift dan lihat kapasitas orang per jam operasional tanpa spreadsheet terpisah." /><button type="button" onClick={() => onNotify("Editor jadwal shift dibuka untuk demo.")} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Atur shift</button></div>
    <div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Minggu berjalan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">16–22 September 2026 · 1 cabang</p></div><button type="button" onClick={() => onNotify("Jadwal berhasil disalin ke minggu berikutnya.")} className="text-[10px] font-black text-[#0f766e]">Salin minggu depan</button></div><div className="mt-5 grid gap-3 sm:grid-cols-7">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, index) => <div key={day} className={`rounded-xl border p-3 ${day === "Jum" ? "border-[#8bd6cc] bg-[#f1fbf9]" : "border-[#edf3f2] bg-[#fbfefe]"}`}><p className="text-[9px] font-black text-[#8aa1a3]">{day}</p><p className="mt-1 text-sm font-black text-[#365b60]">{16 + index}</p><div className="mt-4 space-y-1.5"><span className="block rounded-md bg-[#e6f6f3] px-1.5 py-1 text-[8px] font-black text-[#0f766e]">{index === 4 ? "7 hadir" : "6 terjadwal"}</span><span className="block rounded-md bg-[#fff1dd] px-1.5 py-1 text-[8px] font-black text-[#a56c2b]">{index === 4 ? "1 izin" : "—"}</span></div></div>)}</div></div>
    <div className="grid gap-3 lg:grid-cols-3">{shifts.map((shift) => <section key={shift.label} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><div><span className={`inline-flex rounded-lg px-2 py-1 text-[9px] font-black ${shift.color}`}>{shift.label}</span><p className="mt-2 text-sm font-black text-[#365b60]">{shift.time}</p></div><Clock3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 space-y-2">{shift.people.map((employee) => <div key={employee.id} className="flex items-center gap-2.5 rounded-xl border border-[#edf3f2] p-2.5"><span className={`grid h-7 w-7 place-items-center rounded-full text-[8px] font-black ${employee.tone}`}>{employee.initials}</span><div className="min-w-0"><p className="truncate text-[10px] font-black text-[#365b60]">{employee.name}</p><p className="mt-0.5 text-[9px] text-[#94a8aa]">{employee.role}</p></div></div>)}</div></section>)}</div>
  </div>;
}

function LeaveView({ employees, leaves, onAdd, onUpdate }: { employees: Employee[]; leaves: LeaveRequest[]; onAdd: () => void; onUpdate: (leaveId: string, status: LeaveStatus) => void }) {
  const pending = leaves.filter((leave) => leave.status === "Menunggu").length;
  return <div className="space-y-4">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Leave management" title="Cuti & izin" description="Review pengajuan, cek sisa cuti, dan jaga jadwal operasional tetap aman sebelum menyetujui permintaan." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Buat pengajuan</button></div>
    <div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={CalendarRange} label="Total pengajuan" value={`${leaves.length} pengajuan`} /><SmallMetric icon={AlarmClock} label="Menunggu review" value={`${pending} pengajuan`} /><SmallMetric icon={CheckCircle2} label="Disetujui bulan ini" value={`${leaves.filter((leave) => leave.status === "Disetujui").length} pengajuan`} /></div>
    <div className="space-y-2">{leaves.map((leave) => { const employee = employees.find((entry) => entry.id === leave.employeeId); if (!employee) return null; return <article key={leave.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-full text-[10px] font-black ${employee.tone}`}>{employee.initials}</span><div><p className="text-xs font-black text-[#365b60]">{employee.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{employee.role} · {leave.type}</p></div></div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[8px] font-black ${leavePill(leave.status)}`}>{leave.status}</span>{leave.status === "Menunggu" && <><button type="button" onClick={() => onUpdate(leave.id, "Ditolak")} className="rounded-lg border border-[#f1d8d4] px-2.5 py-2 text-[9px] font-black text-[#aa6359]">Tolak</button><button type="button" onClick={() => onUpdate(leave.id, "Disetujui")} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Setujui</button></>}</div></div><div className="mt-4 grid gap-2 border-t border-[#edf3f2] pt-3 sm:grid-cols-4"><MiniMetric label="Periode" value={`${leave.start} · ${leave.days} hari`} /><MiniMetric label="Alasan" value={leave.reason} /><MiniMetric label="Diajukan" value={leave.submitted} /><MiniMetric label="Sisa cuti" value={`${employee.leaveBalance} hari`} /></div></article>; })}</div>
  </div>;
}

function PayrollView({ employees, total, onExport }: { employees: Employee[]; total: number; onExport: () => void }) {
  return <div className="space-y-4">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Payroll control" title="Payroll" description="Review estimasi gaji pokok berdasarkan data anggota tim sebelum payroll diproses." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export payroll</button></div>
    <div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={CircleDollarSign} label="Total gaji pokok" value={compactRupiah(total)} /><SmallMetric icon={Users} label="Anggota diproses" value={`${employees.length} orang`} /><SmallMetric icon={CheckCircle2} label="Status periode" value="Siap direview" /></div>
    <div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Payroll September 2026</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Gaji pokok · belum termasuk insentif dan potongan</p></div><span className="rounded-full bg-[#e6f6f3] px-2.5 py-1 text-[9px] font-black text-[#0f766e]">Draft</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Anggota</th><th className="pb-3">Jabatan</th><th className="pb-3">Tipe</th><th className="pb-3">Kehadiran</th><th className="pb-3 text-right">Gaji pokok</th></tr></thead><tbody className="divide-y divide-[#edf3f2]">{employees.map((employee) => <tr key={employee.id}><td className="py-3"><div className="flex items-center gap-2.5"><span className={`grid h-8 w-8 place-items-center rounded-full text-[9px] font-black ${employee.tone}`}>{employee.initials}</span><p className="text-[10px] font-black text-[#365b60]">{employee.name}</p></div></td><td className="py-3 text-[10px] font-semibold text-[#648084]">{employee.role}</td><td className="py-3 text-[10px] text-[#648084]">{employee.employment}</td><td className="py-3"><span className={`text-[10px] font-black ${employee.attendance >= 95 ? "text-[#0f766e]" : "text-[#b97820]"}`}>{employee.attendance}%</span></td><td className="py-3 text-right text-[10px] font-black text-[#365b60]">{rupiah(employee.salary)}</td></tr>)}</tbody><tfoot><tr className="border-t border-[#dcebea]"><td colSpan={4} className="pt-4 text-[10px] font-black text-[#648084]">Total estimasi gaji pokok</td><td className="pt-4 text-right text-sm font-black text-[#0f766e]">{rupiah(total)}</td></tr></tfoot></table></div></div>
    <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-4"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><BriefcaseBusiness className="h-3.5 w-3.5" /> Payroll terhubung ke data anggota</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Perubahan jabatan, status, atau gaji dari profil anggota akan menjadi dasar perhitungan payroll periode berikutnya.</p></div>
  </div>;
}

function ReportsView({ employees, attendance, leaves, payrollTotal, onExport }: { employees: Employee[]; attendance: AttendanceRecord[]; leaves: LeaveRequest[]; payrollTotal: number; onExport: () => void }) {
  const bars = [72, 78, 75, 86, 82, 91, 88];
  const present = attendance.filter((record) => record.status === "Hadir" || record.status === "Terlambat").length;
  return <div className="space-y-4">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="People intelligence" title="Laporan HR" description="Gunakan data kehadiran, komposisi tim, dan payroll untuk mengambil keputusan operasional yang lebih terukur." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><FileText className="h-3.5 w-3.5" /> Export laporan</button></div>
    <div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={Users} label="Total anggota" value={`${employees.length} orang`} /><SmallMetric icon={TrendingUp} label="Kehadiran hari ini" value={`${present}/${employees.filter((employee) => employee.status !== "Nonaktif").length}`} /><SmallMetric icon={CircleDollarSign} label="Payroll berjalan" value={compactRupiah(payrollTotal)} /></div>
    <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Tren kehadiran</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Simulasi rata-rata 7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">H-{6 - index}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Komposisi tim</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Berdasarkan departemen</p></div><Users className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 space-y-3">{departments.slice(1).map((entry) => { const count = employees.filter((employee) => employee.department === entry).length; return <div key={entry}><div className="flex items-center justify-between text-[10px]"><span className="font-bold text-[#648084]">{entry}</span><span className="font-black text-[#365b60]">{count} orang</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className="h-full rounded-full bg-[#56b8ae]" style={{ width: `${Math.max(12, (count / Math.max(employees.length, 1)) * 100)}%` }} /></div></div>; })}</div></section></div>
    <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Ringkasan administrasi</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Status penting yang perlu diketahui owner</p></div><Settings2 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[9px] font-semibold text-[#6d878a]">Pengajuan cuti</p><p className="mt-1 text-lg font-black text-[#0f766e]">{leaves.filter((leave) => leave.status === "Disetujui").length} disetujui</p></div><div className="rounded-xl bg-[#fffaf1] p-3"><p className="text-[9px] font-semibold text-[#8d7a5c]">Perlu review</p><p className="mt-1 text-lg font-black text-[#b97820]">{leaves.filter((leave) => leave.status === "Menunggu").length} pengajuan</p></div><div className="rounded-xl bg-[#f4f9f8] p-3"><p className="text-[9px] font-semibold text-[#6d878a]">Kehadiran rata-rata</p><p className="mt-1 text-lg font-black text-[#365b60]">{Math.round(employees.reduce((sum, employee) => sum + employee.attendance, 0) / Math.max(employees.length, 1))}%</p></div></div></section>
  </div>;
}

function EmployeeModal({ employee, onClose, onSubmit }: { employee: Employee | null; onClose: () => void; onSubmit: (employee: Employee) => void }) {
  const [name, setName] = useState(employee?.name ?? "");
  const [role, setRole] = useState(employee?.role ?? "Staff Operasional");
  const [department, setDepartment] = useState<Department>(employee?.department ?? "Operasional");
  const [employment, setEmployment] = useState<EmploymentType>(employee?.employment ?? "Tetap");
  const [shift, setShift] = useState(employee?.shift ?? "09:00–18:00");
  const [salary, setSalary] = useState(String(employee?.salary ?? 4500000));
  return <ModalShell title={employee ? `Edit ${employee.name}` : "Tambah anggota tim"} eyebrow="People directory" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); const cleanName = name.trim(); if (!cleanName) return; const initials = cleanName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); onSubmit({ id: employee?.id ?? `employee-${Date.now()}`, name: cleanName, initials, role, department, employment, shift, salary: Number(salary) || 0, status: employee?.status ?? "Aktif", email: employee?.email ?? `${cleanName.toLowerCase().replaceAll(" ", ".")}@kopinempo.id`, phone: employee?.phone ?? "08xx xxxx xxxx", location: employee?.location ?? "Kopi Nempo · Garut", joinDate: employee?.joinDate ?? "18 Sep 2026", attendance: employee?.attendance ?? 100, leaveBalance: employee?.leaveBalance ?? 12, tone: employee?.tone ?? "bg-[#d7efeb] text-[#0f766e]" }); }} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama lengkap"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Intan Permata" className={fieldClass} /></Field><Field label="Jabatan"><input required value={role} onChange={(event) => setRole(event.target.value)} placeholder="Contoh: Supervisor" className={fieldClass} /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Departemen"><select value={department} onChange={(event) => setDepartment(event.target.value as Department)} className={fieldClass}>{departments.slice(1).map((entry) => <option key={entry}>{entry}</option>)}</select></Field><Field label="Tipe kerja"><select value={employment} onChange={(event) => setEmployment(event.target.value as EmploymentType)} className={fieldClass}><option>Tetap</option><option>Kontrak</option><option>Paruh waktu</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Shift utama"><select value={shift} onChange={(event) => setShift(event.target.value)} className={fieldClass}><option>07:00–16:00</option><option>08:00–17:00</option><option>09:00–18:00</option><option>10:00–19:00</option><option>12:00–21:00</option></select></Field><Field label="Gaji pokok"><input required type="number" min="0" value={salary} onChange={(event) => setSalary(event.target.value)} className={fieldClass} /></Field></div><ModalActions onClose={onClose} submitLabel={employee ? "Simpan perubahan" : "Simpan anggota"} /></form></ModalShell>;
}

function LeaveModal({ employees, onClose, onSubmit }: { employees: Employee[]; onClose: () => void; onSubmit: (leave: LeaveRequest) => void }) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [type, setType] = useState<LeaveRequest["type"]>("Cuti tahunan");
  const [days, setDays] = useState("1");
  const [reason, setReason] = useState("");
  return <ModalShell title="Buat pengajuan cuti" eyebrow="Leave management" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit({ id: `leave-${Date.now()}`, employeeId, type, start: "18 Sep 2026", end: `${18 + Math.max(Number(days) - 1, 0)} Sep 2026`, days: Number(days) || 1, reason: reason.trim() || "Pengajuan baru", status: "Menunggu", submitted: "Baru saja" }); }} className="space-y-4"><Field label="Anggota tim"><select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} className={fieldClass}>{employees.filter((employee) => employee.status !== "Nonaktif").map((employee) => <option key={employee.id} value={employee.id}>{employee.name} · {employee.department}</option>)}</select></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Jenis pengajuan"><select value={type} onChange={(event) => setType(event.target.value as LeaveRequest["type"])} className={fieldClass}><option>Cuti tahunan</option><option>Izin pribadi</option><option>Sakit</option></select></Field><Field label="Jumlah hari"><input type="number" min="1" max="30" value={days} onChange={(event) => setDays(event.target.value)} className={fieldClass} /></Field></div><Field label="Alasan"><textarea required value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Contoh: keperluan keluarga" className={`${fieldClass} min-h-24 resize-none`} /></Field><ModalActions onClose={onClose} submitLabel="Kirim pengajuan" /></form></ModalShell>;
}

function EmployeeDrawer({ employee, onClose, onEdit, onStatus }: { employee: Employee; onClose: () => void; onEdit: () => void; onStatus: (status: EmployeeStatus) => void }) {
  return <div className="fixed inset-0 z-[75] flex justify-end bg-[#123f47]/30 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" aria-labelledby="employee-drawer-title" className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className={`grid h-12 w-12 place-items-center rounded-full text-xs font-black ${employee.tone}`}>{employee.initials}</span><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Profil anggota</p><h2 id="employee-drawer-title" className="mt-1 text-lg font-black text-[#183b43]">{employee.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{employee.role}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup profil" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-7 grid grid-cols-2 gap-2"><MiniMetric label="Departemen" value={employee.department} /><MiniMetric label="Tipe kerja" value={employee.employment} /><MiniMetric label="Bergabung" value={employee.joinDate} /><MiniMetric label="Sisa cuti" value={`${employee.leaveBalance} hari`} /></div><div className="mt-5 space-y-2 rounded-2xl bg-[#f4fbfa] p-4"><InfoRow icon={Mail} label="Email" value={employee.email} /><InfoRow icon={MapPin} label="Lokasi" value={employee.location} /><InfoRow icon={Clock3} label="Shift" value={employee.shift} /><InfoRow icon={Gauge} label="Kehadiran" value={`${employee.attendance}%`} /></div><div className="mt-5"><p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6d878a]">Status keanggotaan</p><div className="mt-2 grid grid-cols-3 gap-2">{(["Aktif", "Cuti", "Nonaktif"] as EmployeeStatus[]).map((status) => <button key={status} type="button" onClick={() => onStatus(status)} className={`rounded-xl px-2 py-2.5 text-[9px] font-black ${employee.status === status ? "bg-[#e6f6f3] text-[#0f766e]" : "border border-[#dcebea] text-[#8aa1a3] hover:border-[#b9ded8]"}`}>{status}</button>)}</div></div><button type="button" onClick={onEdit} className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><Pencil className="h-3.5 w-3.5" /> Edit profil</button></aside></div>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1.5 text-lg font-black tracking-tight text-[#244950]">{title}</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Users; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><CheckCircle2 className="h-3.5 w-3.5 text-[#9cb3b5]" /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function SmallMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#0f766e]" /><span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8ba3a4]">{label}</span></div><p className="mt-3 text-lg font-black text-[#183b43]">{value}</p></div>;
}

function QuickAction({ icon: Icon, title, detail, onClick }: { icon: typeof Users; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-2xl border border-[#e3eeed] bg-white p-4 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-4 w-4" /></span><p className="mt-3 text-[11px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{detail}</p><ArrowRight className="mt-3 h-3.5 w-3.5 text-[#0f766e]" /></button>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 truncate text-[11px] font-black text-[#365b60]">{value}</p></div>;
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return <div className="flex items-center gap-2.5"><Icon className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" /><div className="min-w-0"><p className="text-[8px] font-black uppercase tracking-[0.08em] text-[#94a8aa]">{label}</p><p className="truncate text-[10px] font-bold text-[#365b60]">{value}</p></div></div>;
}

function StatusPill({ status }: { status: EmployeeStatus }) {
  return <span className={`rounded-full px-2 py-1 text-[8px] font-black ${status === "Aktif" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Cuti" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f2f4f4] text-[#6d878a]"}`}>{status}</span>;
}

function attendanceTone(status: AttendanceStatus) {
  return status === "Hadir" ? "text-[#0f766e]" : status === "Terlambat" ? "text-[#b97820]" : status === "Izin" ? "text-[#7362a6]" : "text-[#aa6359]";
}

function attendancePill(status: AttendanceStatus) {
  return status === "Hadir" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Terlambat" ? "bg-[#fff1dd] text-[#a56c2b]" : status === "Izin" ? "bg-[#ece9f8] text-[#7362a6]" : "bg-[#f3e2df] text-[#aa6359]";
}

function leavePill(status: LeaveStatus) {
  return status === "Disetujui" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Menunggu" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f3e2df] text-[#aa6359]";
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] py-10 text-center text-xs font-semibold text-[#8aa1a3]">{label}</div>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";