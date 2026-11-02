import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useRoute, useLocation } from "@/lib/wouter";
import {
  ArrowLeft, CheckCircle2, ChevronRight, Upload, Copy,
  User, Phone, Mail, Calendar, School, FileText,
  CreditCard, Building2, Landmark, Banknote, Image, X,
  Trophy, PartyPopper,
} from "lucide-react";

function formatRupiah(n: number) {
  if (n === 0) return "GRATIS";
  return "Rp " + n.toLocaleString("id-ID");
}

function copyToClipboard(text: string, cb: () => void) {
  navigator.clipboard.writeText(text).then(cb);
}

const STEP_LABELS = [
  "Kategori",
  "Data Diri",
  "Pembayaran",
  "Bukti Bayar",
  "Selesai",
];

interface ApiLomba {
  id: number;
  name: string;
  category: string;
  date: string | null;
  location: string;
  image: string;
  description: string;
  prize: string;
  organizer: string;
  fee: number;
  max_peserta: number;
}

export default function PerlombaanDaftarPage() {
  const [, params] = useRoute("/perlombaan/:id/daftar");
  const [, navigate] = useLocation();
  const [lomba, setLomba] = useState<ApiLomba | null>(null);
  const [loadingLomba, setLoadingLomba] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/perlombaan/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setLomba(data))
      .catch(() => setLomba(null))
      .finally(() => setLoadingLomba(false));
  }, [params?.id]);

  const [step, setStep] = useState(1);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    tglLahir: "",
    instansi: "",
    kota: "",
    catatan: "",
    setuju: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const syntheticSubs = lomba ? [{ label: lomba.category, fee: lomba.fee }] : [];
  const chosenSub = selectedSub !== null ? syntheticSubs[selectedSub] : null;

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validateForm() {
    const errs: Record<string, string> = {};
    if (!form.nama.trim()) errs.nama = "Nama lengkap wajib diisi";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email tidak valid";
    if (!form.whatsapp.trim() || form.whatsapp.length < 9) errs.whatsapp = "Nomor WhatsApp tidak valid";
    if (!form.tglLahir) errs.tglLahir = "Tanggal lahir wajib diisi";
    if (!form.instansi.trim()) errs.instansi = "Sekolah/instansi wajib diisi";
    if (!form.kota.trim()) errs.kota = "Kota asal wajib diisi";
    if (!form.setuju) errs.setuju = "Anda harus menyetujui pernyataan di atas";
    return errs;
  }

  function nextStep() {
    if (step === 2) {
      const errs = validateForm();
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    }
    setStep(s => Math.min(s + 1, 5));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = ev => setUploadPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const stepBarPercent = ((step - 1) / 4) * 100;

  if (loadingLomba) {
    return <Layout hideBottomNav><div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gray-200 border-t-violet-600 rounded-full animate-spin" /></div></Layout>;
  }
  if (!lomba) {
    return <Layout hideBottomNav><div className="flex flex-col items-center justify-center min-h-screen gap-3"><p className="font-bold text-gray-500">Lomba tidak ditemukan</p><button onClick={() => navigate("/perlombaan")} className="text-violet-600 text-sm underline">Kembali ke Daftar Lomba</button></div></Layout>;
  }

  return (
    <Layout hideBottomNav>
      <SEO title="Daftar Perlombaan" noIndex />
      {/* Fixed top bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => step === 1 ? navigate(`/perlombaan/${lomba!.id}`) : setStep(s => s - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4 text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900 text-sm truncate">{lomba.name}</p>
            <p className="text-[11px] text-gray-400">{STEP_LABELS[step - 1]} — Langkah {step} dari 5</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 mx-0">
          <div
            className="h-1 bg-violet-600 transition-all duration-500 ease-out"
            style={{ width: `${stepBarPercent}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const cur  = n === step;
            return (
              <div key={n} className="flex flex-col items-center gap-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  done ? "bg-violet-600 text-white" : cur ? "bg-violet-600 text-white ring-4 ring-violet-100" : "bg-gray-100 text-gray-400"
                }`}>
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
                </div>
                <span className={`text-[9px] font-semibold ${cur ? "text-violet-600" : done ? "text-gray-500" : "text-gray-300"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">

        {/* ══ STEP 1 — Pilih Kategori ══════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-extrabold text-gray-900 text-xl leading-tight">Pilih Kategori Lomba</h1>
              <p className="text-gray-500 text-sm mt-1">Pilih kategori yang sesuai dengan diri Anda</p>
            </div>

            {/* Lomba info card */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 flex gap-0 shadow-sm">
              <img src={lomba.image} alt={lomba.name} className="w-20 h-20 object-cover shrink-0" />
              <div className="px-3 py-2.5 flex flex-col justify-center">
                <span className="inline-block text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full mb-1 w-fit">
                  {lomba.category}
                </span>
                <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{lomba.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{lomba.organizer}</p>
              </div>
            </div>

            {/* Subcategory selection */}
            <div className="space-y-3">
              {syntheticSubs.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSub(i)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                    selectedSub === i
                      ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                      : "border-gray-100 bg-white hover:border-violet-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${selectedSub === i ? "text-violet-700" : "text-gray-800"}`}>
                        {sub.label}
                      </p>
                      </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-extrabold text-base ${sub.fee === 0 ? "text-emerald-600" : selectedSub === i ? "text-violet-700" : "text-gray-900"}`}>
                        {formatRupiah(sub.fee)}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSub === i ? "border-violet-500 bg-violet-500" : "border-gray-300"
                      }`}>
                        {selectedSub === i && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Syarat singkat */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="font-bold text-blue-800 text-sm flex items-center gap-1.5 mb-2">
                <FileText className="h-4 w-4" />
                Syarat & Ketentuan Singkat
              </p>
              <ul className="space-y-1">
                {[
                  "Peserta adalah Warga Negara Indonesia",
                  "Mengisi formulir pendaftaran dengan data yang benar",
                  "Melampirkan bukti pembayaran (jika ada biaya pendaftaran)",
                  "Keputusan juri bersifat mutlak dan tidak dapat diganggu gugat",
                  "Peserta wajib hadir sesuai jadwal yang ditentukan panitia",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[#0172B1] text-xs">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#1BA0E2] shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={selectedSub === null}
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200"
            >
              Lanjut — Isi Data Diri <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ══ STEP 2 — Data Diri ═══════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-extrabold text-gray-900 text-xl">Data Diri Peserta</h1>
              <p className="text-gray-500 text-sm mt-1">Pastikan data sesuai identitas resmi Anda</p>
            </div>

            {/* Selected category badge */}
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
              <Trophy className="h-4 w-4 text-violet-500 shrink-0" />
              <span className="text-violet-700 text-xs font-semibold flex-1 truncate">{chosenSub?.label}</span>
              <span className="font-extrabold text-violet-700 text-sm">{formatRupiah(chosenSub?.fee ?? 0)}</span>
            </div>

            <div className="space-y-4">
              {/* Nama */}
              <Field
                icon={<User className="h-4 w-4" />}
                label="Nama Lengkap"
                required
                error={errors.nama}
              >
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleFormChange}
                  placeholder="Sesuai KTP / Kartu Pelajar"
                  className={inputCls(errors.nama)}
                />
              </Field>

              {/* Email */}
              <Field icon={<Mail className="h-4 w-4" />} label="Alamat Email" required error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="contoh@email.com"
                  className={inputCls(errors.email)}
                />
              </Field>

              {/* WhatsApp */}
              <Field icon={<Phone className="h-4 w-4" />} label="Nomor WhatsApp" required error={errors.whatsapp}>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleFormChange}
                  placeholder="08xxxxxxxxxx"
                  className={inputCls(errors.whatsapp)}
                />
              </Field>

              {/* Tanggal Lahir */}
              <Field icon={<Calendar className="h-4 w-4" />} label="Tanggal Lahir" required error={errors.tglLahir}>
                <input
                  type="date"
                  name="tglLahir"
                  value={form.tglLahir}
                  onChange={handleFormChange}
                  className={inputCls(errors.tglLahir)}
                />
              </Field>

              {/* Instansi */}
              <Field icon={<School className="h-4 w-4" />} label="Sekolah / Instansi" required error={errors.instansi}>
                <input
                  name="instansi"
                  value={form.instansi}
                  onChange={handleFormChange}
                  placeholder="Nama sekolah, perguruan tinggi, atau perusahaan"
                  className={inputCls(errors.instansi)}
                />
              </Field>

              {/* Kota */}
              <Field icon={<Building2 className="h-4 w-4" />} label="Kota Asal" required error={errors.kota}>
                <input
                  name="kota"
                  value={form.kota}
                  onChange={handleFormChange}
                  placeholder="Contoh: Garut, Bandung, Jakarta"
                  className={inputCls(errors.kota)}
                />
              </Field>

              {/* Catatan */}
              <Field icon={<FileText className="h-4 w-4" />} label="Catatan / Informasi Tambahan">
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Opsional — tuliskan informasi tambahan jika ada"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
                />
              </Field>

              {/* Pernyataan */}
              <div className={`flex items-start gap-3 rounded-xl p-3 border ${errors.setuju ? "border-red-300 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
                <button
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, setuju: !p.setuju })); setErrors(e => ({ ...e, setuju: "" })); }}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-colors ${form.setuju ? "bg-violet-600 border-violet-600" : "border-gray-300 bg-white"}`}
                >
                  {form.setuju && <CheckCircle2 className="h-3 w-3 text-white" />}
                </button>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Saya menyatakan bahwa data yang saya isi adalah benar dan saya menyetujui syarat & ketentuan lomba yang berlaku.
                </p>
              </div>
              {errors.setuju && <p className="text-red-500 text-xs -mt-3">{errors.setuju}</p>}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Lanjut — Info Pembayaran <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ══ STEP 3 — Info Biaya & Pembayaran ════════════════════ */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-extrabold text-gray-900 text-xl">Informasi Pembayaran</h1>
              <p className="text-gray-500 text-sm mt-1">Lakukan pembayaran ke rekening di bawah ini</p>
            </div>

            {/* Ringkasan */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3">
                <p className="text-white/80 text-xs font-semibold">Total yang harus dibayar</p>
                <p className="text-white font-extrabold text-3xl tracking-tight">{formatRupiah(chosenSub?.fee ?? 0)}</p>
              </div>
              <div className="px-4 py-3 space-y-2 bg-white">
                <Row label="Lomba">{lomba.name}</Row>
                <Row label="Kategori">{chosenSub?.label}</Row>
                <Row label="Peserta">{form.nama}</Row>
                <Row label="Tanggal">{lomba.date ?? "—"}</Row>
              </div>
            </div>

            {/* Rekening tujuan */}
            {(chosenSub?.fee ?? 0) > 0 && (
              <div className="space-y-3">
                <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-violet-500" />
                  Transfer ke Rekening
                </p>
                <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                      <Banknote className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-base">BRI</p>
                      <p className="text-gray-500 text-xs">Bank Rakyat Indonesia</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
                    <p className="text-gray-400 text-xs font-semibold mb-0.5">Nomor Rekening</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-extrabold text-gray-900 text-lg tracking-widest">1234-5678-9012</p>
                      <button
                        onClick={() => copyToClipboard("123456789012", () => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
                        className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${copied ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600 hover:bg-violet-200"}`}
                      >
                        {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Disalin!" : "Salin"}
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
                    <p className="text-gray-400 text-xs font-semibold mb-0.5">Atas Nama</p>
                    <p className="font-bold text-gray-900">Dinas Pariwisata Garut</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-3.5 border border-blue-100">
                  <p className="text-blue-800 text-xs leading-relaxed">
                    <span className="font-bold">Penting:</span> Cantumkan nama peserta ({form.nama}) sebagai keterangan transfer. Simpan bukti pembayaran untuk diunggah di langkah berikutnya.
                  </p>
                </div>
              </div>
            )}

            {/* Gratis — langsung lanjut */}
            {(chosenSub?.fee ?? 0) === 0 && (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-emerald-800">Kategori ini GRATIS!</p>
                  <p className="text-emerald-700 text-xs">Tidak diperlukan pembayaran. Lanjut langsung ke unggah bukti.</p>
                </div>
              </div>
            )}

            {/* Metode lain */}
            {(chosenSub?.fee ?? 0) > 0 && (
              <div className="space-y-2">
                <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-violet-500" />
                  Metode Pembayaran Lain
                </p>
                {[
                  { name: "QRIS", desc: "Scan kode QR di loket pendaftaran" },
                  { name: "Tunai", desc: "Bayar langsung di sekretariat lomba" },
                ].map(m => (
                  <div key={m.name} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-white">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{m.name}</p>
                      <p className="text-gray-400 text-xs">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Sudah Bayar — Unggah Bukti <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ══ STEP 4 — Upload Bukti Bayar ═════════════════════════ */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-extrabold text-gray-900 text-xl">Unggah Bukti Pembayaran</h1>
              <p className="text-gray-500 text-sm mt-1">
                {(chosenSub?.fee ?? 0) === 0
                  ? "Unggah foto / dokumen sebagai bukti identitas peserta"
                  : "Unggah screenshot atau foto struk transfer Anda"}
              </p>
            </div>

            {/* Upload area */}
            <div>
              {!uploadPreview ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-violet-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center transition-colors">
                    <Upload className="h-7 w-7 text-violet-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-sm">Klik untuk pilih file</p>
                    <p className="text-gray-400 text-xs mt-0.5">JPG, PNG, PDF — Maks. 5 MB</p>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-violet-200">
                  <img src={uploadPreview} alt="Preview" className="w-full max-h-72 object-cover" />
                  <button
                    onClick={() => { setUploadFile(null); setUploadPreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="px-4 py-2.5 bg-white flex items-center gap-2">
                    <Image className="h-4 w-4 text-violet-500 shrink-0" />
                    <span className="text-sm text-gray-700 font-semibold truncate">{uploadFile?.name}</span>
                    <span className="text-gray-400 text-xs shrink-0">
                      {uploadFile ? `${(uploadFile.size / 1024).toFixed(0)} KB` : ""}
                    </span>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Ringkasan singkat */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
              <p className="font-bold text-gray-700 text-xs uppercase tracking-wide mb-2">Ringkasan Pendaftaran</p>
              <Row label="Peserta">{form.nama}</Row>
              <Row label="Kategori">{chosenSub?.label}</Row>
              <Row label="Biaya">{formatRupiah(chosenSub?.fee ?? 0)}</Row>
              <Row label="WhatsApp">{form.whatsapp}</Row>
            </div>

            <button
              disabled={!uploadPreview && (chosenSub?.fee ?? 0) > 0}
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Kirim Pendaftaran <ChevronRight className="h-4 w-4" />
            </button>

            {(chosenSub?.fee ?? 0) === 0 && !uploadPreview && (
              <button
                onClick={nextStep}
                className="w-full py-3 rounded-2xl font-semibold text-sm border border-violet-300 text-violet-600 hover:bg-violet-50 transition-all"
              >
                Lewati — Lanjut tanpa unggah
              </button>
            )}
          </div>
        )}

        {/* ══ STEP 5 — Selesai ═════════════════════════════════════ */}
        {step === 5 && (
          <div className="flex flex-col items-center gap-6 pt-6">
            {/* Success animation */}
            <div className="relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-violet-100 animate-ping absolute opacity-20" />
              <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center shadow-xl shadow-violet-300 relative z-10">
                <PartyPopper className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="font-extrabold text-gray-900 text-2xl">Pendaftaran Berhasil!</h1>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Terima kasih, <span className="font-bold text-gray-800">{form.nama}</span>! Pendaftaran Anda pada lomba <span className="font-bold text-violet-700">{lomba.name}</span> telah kami terima.
              </p>
            </div>

            {/* Konfirmasi card */}
            <div className="w-full rounded-2xl border border-violet-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3">
                <p className="text-white font-bold text-sm">Detail Pendaftaran</p>
              </div>
              <div className="px-4 py-3 space-y-2.5 bg-white">
                <Row label="Nomor Daftar">
                  <span className="font-bold text-violet-700">#{lomba.id}-{Date.now().toString().slice(-6)}</span>
                </Row>
                <Row label="Lomba">{lomba.name}</Row>
                <Row label="Kategori">{chosenSub?.label}</Row>
                <Row label="Biaya">{formatRupiah(chosenSub?.fee ?? 0)}</Row>
                <Row label="Status">
                  <span className="text-[#0172B1] font-bold">Menunggu Verifikasi</span>
                </Row>
              </div>
            </div>

            <div className="w-full bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-blue-800 text-sm font-bold mb-1">Langkah Selanjutnya</p>
              <ul className="space-y-1.5">
                {[
                  "Panitia akan menghubungi via WhatsApp dalam 1×24 jam",
                  "Simpan nomor pendaftaran Anda",
                  "Cek inbox email untuk detail lebih lanjut",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[#0172B1] text-xs">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1BA0E2] shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => navigate("/perlombaan-saya")}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transition-all duration-200"
              >
                Lihat Lomba Saya
              </button>
              <button
                onClick={() => navigate("/perlombaan")}
                className="w-full py-3 rounded-2xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Kembali ke Daftar Lomba
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ── Helper components ───────────────────────────── */
function Field({
  icon, label, required, error, children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
        <span className="text-violet-500">{icon}</span>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-400 text-xs shrink-0">{label}</span>
      <span className="text-gray-800 text-xs font-semibold text-right">{children}</span>
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all ${
    error ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;
}
