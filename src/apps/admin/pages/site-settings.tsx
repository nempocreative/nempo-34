import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import { Save, RefreshCw, Globe, Phone, Instagram, Facebook, CheckCircle2, Wallet, Banknote, Truck, Percent } from "lucide-react";
import { inputCls } from "@/apps/admin/components/modal";

const sections = [
  {
    title: "Informasi Umum",
    icon: Globe,
    fields: [
      { key: "site_name", label: "Nama Website", placeholder: "Nempo.id" },
      { key: "site_tagline", label: "Tagline / Slogan", placeholder: "Jelajahi Keindahan Jawa Barat" },
    ],
  },
  {
    title: "Kontak",
    icon: Phone,
    fields: [
      { key: "contact_email", label: "Email Kontak", placeholder: "info@nempo.id", type: "email" },
      { key: "contact_phone", label: "Nomor WhatsApp / HP", placeholder: "+62 812 0000 0000", type: "tel" },
    ],
  },
  {
    title: "Media Sosial",
    icon: Instagram,
    fields: [
      { key: "social_instagram", label: "Instagram", placeholder: "@nempo.id" },
      { key: "social_facebook", label: "Facebook", placeholder: "nempo.id" },
    ],
  },
  {
    title: "Dompet Mitra",
    icon: Wallet,
    fields: [
      {
        key: "mitra_commission_percent",
        label: "Komisi Platform per Transaksi Tiket (%)",
        placeholder: "5",
        type: "number",
        hint: "Persentase yang dipotong dari setiap tiket event terjual sebelum masuk ke saldo mitra. Default 5% jika kosong.",
      },
    ],
  },
  {
    title: "Pembayaran Manual Jajan YUK",
    icon: Banknote,
    fields: [
      { key: "jajan_yuk_manual_whatsapp", label: "WhatsApp konfirmasi pembayaran", placeholder: "Gunakan nomor yang menerima bukti transfer", type: "tel", hint: "Jika kosong, nomor WhatsApp kontak umum akan digunakan." },
      { key: "jajan_yuk_manual_bank_name", label: "Nama bank", placeholder: "Contoh: BCA" },
      { key: "jajan_yuk_manual_bank_account_no", label: "Nomor rekening", placeholder: "Isi hanya rekening yang benar-benar aktif" },
      { key: "jajan_yuk_manual_bank_account_name", label: "Nama pemilik rekening", placeholder: "Sesuai rekening penerima" },
      { key: "jajan_yuk_manual_qris_image", label: "URL gambar QRIS", placeholder: "https://…", hint: "Opsional. Gunakan URL gambar QRIS yang dapat diakses publik." },
    ],
  },
  {
    title: "Pengantaran Jajan YUK",
    icon: Truck,
    fields: [
      {
        key: "jajan_yuk_delivery_discount",
        label: "Diskon ongkir (Rp)",
        placeholder: "0",
        type: "number",
        hint: "Nominal potongan ongkir untuk setiap order. Isi 0 untuk menonaktifkan; maksimal Rp9.000.",
      },
    ],
  },
  {
    title: "Biaya Layanan Jajan YUK",
    icon: Percent,
    fields: [
      {
        key: "jajan_yuk_service_fee_percent",
        label: "Biaya layanan (%)",
        placeholder: "2",
        type: "number",
        hint: "Persentase biaya layanan yang dihitung dari subtotal menu. Default 2%; isi 0 untuk menonaktifkan.",
      },
    ],
  },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => {
    setLoading(true);
    api.settings.get().then(setSettings).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.settings.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Pengaturan Website</h1>
        <p className="text-sm text-gray-500 mt-0.5">Konfigurasi informasi dasar website Nempo.id</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 py-16 justify-center">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat pengaturan...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
          {sections.map(section => (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <section.icon className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h2 className="text-sm font-bold text-gray-700">{section.title}</h2>
              </div>
              <div className="p-5 space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type={(field as { type?: string }).type ?? "text"}
                      className={inputCls}
                      value={settings[field.key] ?? ""}
                      onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                    {(field as { hint?: string }).hint && (
                      <p className="text-xs text-gray-400 mt-1">{(field as { hint?: string }).hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm shadow-blue-200"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            {saved && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Pengaturan berhasil disimpan!
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
