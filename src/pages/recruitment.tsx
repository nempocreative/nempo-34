import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { CommunityApplicationForm } from "@/components/community-application-form";
import { CheckCircle2, Users, FolderOpen, Handshake, GraduationCap, CalendarHeart } from "lucide-react";

export default function RecruitmentPage() {
  return (
    <Layout>
      <SEO
        title="Recruitment — Gabung Nempo Community"
        description="Isi formulir open recruitment Nempo Community. Terbuka untuk pelajar, mahasiswa, dan umum tanpa biaya pendaftaran."
        keywords="recruitment Nempo, open recruitment, komunitas anak muda Jawa Barat, gabung komunitas"
        path="/recruitment"
      />

      <main className="min-h-screen overflow-hidden bg-[#f5f5ff] text-[#37215b]">
        {/* ===== HEADER ===== */}
        <section className="relative border-b border-[#dce4fb] bg-[#eaf0ff]">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d85da4]/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#6e4bb4]/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e5d3e6] bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#a62f78]">
              <Users className="h-3.5 w-3.5" />
              Open recruitment
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] text-[#37215b] sm:text-4xl lg:text-5xl">
              Gabung bareng{" "}
              <span className="text-[#a62f78]">Nempo Community.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#62677c] sm:text-base">
              Isi formulir singkat ini dan ceritakan minatmu. Tim kami akan
              menghubungimu lewat WhatsApp untuk langkah berikutnya.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {[
                "Terbuka untuk pelajar, mahasiswa, dan umum",
                "Tanpa biaya pendaftaran",
                "Boleh daftar lebih dari satu minat nanti",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm font-semibold text-[#3f3564]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#a62f78]" />
                  {point}
                </li>
              ))}
            </ul>
            <a href="#gabung" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#a62f78] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#a62f78]/30 transition hover:-translate-y-0.5">
              Daftar sekarang
            </a>
          </div>
        </section>

        {/* ===== PERKS ===== */}
        <section className="border-b border-[#dce4fb]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
            <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">Yang kamu dapat</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: CalendarHeart, t: "Terlibat di event", d: "Ikut jadi bagian tim di acara-acara Nempo." },
                { icon: GraduationCap, t: "Belajar langsung", d: "Asah skill kreatif, konten, dan organisasi bareng tim." },
                { icon: Handshake, t: "Relasi baru", d: "Kenalan dengan anak muda dan kreator se-Jawa Barat." },
                { icon: FolderOpen, t: "Portofolio nyata", d: "Pengalaman yang bisa kamu tunjukkan ke mana saja." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="rounded-3xl border border-[#e5d3e6] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#a62f78]/10 text-[#a62f78]"><Icon className="h-5 w-5" /></span>
                  <p className="mt-4 text-sm font-extrabold text-[#37215b]">{t}</p>
                  <p className="mt-1 text-xs leading-5 text-[#62677c]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FORM ===== */}
        <section id="gabung" className="scroll-mt-24 border-b border-[#d9daf3]">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="rounded-[2rem] border border-[#e5d3e6] bg-white p-5 shadow-xl shadow-[#6e4bb4]/10 sm:p-8">
              <h2 className="text-xl font-black tracking-[-0.03em] sm:text-2xl">Formulir pendaftaran</h2>
              <p className="mt-1 mb-6 text-sm text-[#62677c]">Cuma butuh 1 menit. Isianmu langsung dibuka di WhatsApp resmi Nempo.</p>
              <CommunityApplicationForm />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
