import { Layout } from "@/components/layout";
import { useLocation } from "@/lib/wouter";
import { ArrowLeft, Clock } from "lucide-react";

export default function ComingSoonPage() {
  const [, navigate] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 text-[15px]">Kembali</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg, #0194f3 0%, #0172B1 100%)" }}
          >
            <Clock className="w-9 h-9 text-white" strokeWidth={1.5} />
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-2 text-center">Segera Hadir</h2>
          <p className="text-sm text-gray-400 text-center leading-relaxed max-w-xs">
            Fitur ini sedang dalam pengembangan dan akan segera tersedia. Terima kasih atas kesabarannya!
          </p>

          <div
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "rgba(1,148,243,0.08)" }}
          >
            <Clock className="w-4 h-4" style={{ color: "#0194f3" }} />
            <span className="text-xs font-semibold" style={{ color: "#0194f3" }}>
              Pantau terus update terbaru di @nempo.id
            </span>
          </div>

          <button
            onClick={() => navigate("/settings")}
            className="mt-8 px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-md active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #0194f3 0%, #0172B1 100%)" }}
          >
            Kembali ke Pengaturan
          </button>
        </div>
      </div>
    </Layout>
  );
}
