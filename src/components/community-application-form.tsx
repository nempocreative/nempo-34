import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { NEMPO_WA_NUMBER } from "@/lib/contact";
import { applicationWaUrl, interestOptions } from "@/data/community-recruitment";

const applicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 huruf")
    .max(100, "Nama maksimal 100 huruf"),
  email: z
    .string()
    .trim()
    .email("Alamat email belum benar")
    .max(255, "Email terlalu panjang"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{9,16}$/, "Nomor WhatsApp belum benar"),
  interest: z.string().min(1, "Pilih salah satu minat"),
  reason: z
    .string()
    .trim()
    .max(1000, "Cerita maksimal 1000 karakter")
    .optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const emptyForm: ApplicationForm = {
  full_name: "",
  email: "",
  whatsapp: "",
  interest: "",
  reason: "",
};

const inputClass =
  "w-full rounded-2xl border border-[#d8def5] bg-white px-4 py-3 text-sm text-[#37215b] outline-none transition placeholder:text-[#a8a6c2] focus:border-[#a62f78] focus:ring-2 focus:ring-[#a62f78]/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-[#5f5578]";

/**
 * Formulir open recruitment Nempo Community. Satu sumber untuk halaman
 * Komunitas dan halaman Recruitment supaya pengisiannya selalu sama.
 *
 * Alur: isian divalidasi, lalu WhatsApp resmi Nempo dibuka dengan pesan
 * terisi otomatis, dan salinan isian disimpan ke arsip komunitas.
 */
export function CommunityApplicationForm() {
  const [form, setForm] = useState<ApplicationForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [archived, setArchived] = useState(true);

  const updateField = (field: keyof ApplicationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ApplicationForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ApplicationForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const url = applicationWaUrl(parsed.data);
    setWaUrl(url);
    // Dibuka di sini, masih dalam gestur klik, supaya tidak diblokir peramban.
    window.open(url, "_blank", "noopener,noreferrer");

    setSubmitting(true);
    const { error } = await supabase.from("community_applications").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      interest: parsed.data.interest,
      reason: parsed.data.reason || null,
    });
    setSubmitting(false);
    setArchived(!error);
    setSubmitted(true);
  };

  return (
    <div className="rounded-[2rem] border border-[#e5e2f5] bg-white p-6 shadow-[0_20px_50px_rgba(61,42,113,.10)] sm:p-8">
      {submitted ? (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a62f78]/10">
            <CheckCircle2 className="h-8 w-8 text-[#a62f78]" />
          </div>
          <h3 className="mt-5 text-xl font-black text-[#37215b]">
            Pendaftaranmu sudah masuk!
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#62677c]">
            Terima kasih, {form.full_name.split(" ")[0]}. Isian formulirmu sudah
            dibuka di WhatsApp Nempo — tinggal tekan kirim di sana supaya tim
            kami langsung membacanya.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a62f78] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7b2866]/25 transition hover:-translate-y-0.5 hover:bg-[#862761]"
          >
            <MessageCircle className="h-4 w-4" />
            Buka WhatsApp lagi
          </a>
          {!archived && (
            <p className="mt-3 max-w-sm text-[11px] leading-5 text-[#c2274f]">
              Salinan isianmu belum tersimpan di arsip kami, tapi pesan
              WhatsApp-nya sudah terbuka. Kirimkan saja lewat WhatsApp.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setSubmitted(false);
              setWaUrl("");
              setArchived(true);
            }}
            className="mt-5 text-sm font-bold text-[#a62f78] underline-offset-4 hover:underline"
          >
            Daftarkan orang lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="full_name" className={labelClass}>
                Nama lengkap
              </label>
              <input
                id="full_name"
                type="text"
                value={form.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="Nama kamu"
                className={inputClass}
                maxLength={100}
              />
              {errors.full_name && (
                <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">
                  {errors.full_name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                Nomor WhatsApp
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={form.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className={inputClass}
                maxLength={16}
              />
              {errors.whatsapp && (
                <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">
                  {errors.whatsapp}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="nama@email.com"
                className={inputClass}
                maxLength={255}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <span className={labelClass}>Minat utama</span>
              <div className="grid grid-cols-2 gap-2.5">
                {interestOptions.map((option) => {
                  const active = form.interest === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("interest", option)}
                      className={`rounded-2xl border px-3 py-3 text-left text-xs font-bold transition sm:text-sm ${
                        active
                          ? "border-[#a62f78] bg-[#a62f78] text-white shadow-md shadow-[#a62f78]/20"
                          : "border-[#d8def5] bg-[#faf9ff] text-[#37215b] hover:border-[#a62f78]/40"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {errors.interest && (
                <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">
                  {errors.interest}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="reason" className={labelClass}>
                Ceritakan sedikit tentang kamu{" "}
                <span className="font-medium normal-case text-[#a8a6c2]">
                  (opsional)
                </span>
              </label>
              <textarea
                id="reason"
                value={form.reason}
                onChange={(e) => updateField("reason", e.target.value)}
                placeholder="Apa yang ingin kamu lakukan bersama komunitas ini?"
                rows={4}
                className={`${inputClass} resize-none`}
                maxLength={1000}
              />
              {errors.reason && (
                <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">
                  {errors.reason}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#a62f78] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7b2866]/25 transition hover:-translate-y-0.5 hover:bg-[#862761] disabled:translate-y-0 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                Kirim pendaftaran ke WhatsApp
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] leading-5 text-[#a8a6c2]">
            Isianmu dibuka di WhatsApp resmi Nempo {NEMPO_WA_NUMBER} — tinggal
            tekan kirim. Data ini hanya dipakai untuk menghubungimu soal
            kegiatan komunitas.
          </p>
        </form>
      )}
    </div>
  );
}
