import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Trophy, Calendar, MapPin } from "lucide-react";

export default function PerlombaanSayaPage() {
  const registrations = [
    { id: "REG-001", title: "Garut Photography Contest 2024", date: "30 Okt 2024", status: "Terdaftar", location: "Online" }
  ];

  return (
    <Layout>
      <SEO title="Perlombaan Saya" noIndex />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Perlombaan Saya</h1>

        {registrations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {registrations.map(reg => (
              <div key={reg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-3">
                   <div className="bg-red-50 p-2 rounded-xl text-red-500">
                      <Trophy className="h-6 w-6" />
                   </div>
                   <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {reg.status}
                   </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{reg.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                   <Calendar className="h-4 w-4 mr-2" /> Penutupan: {reg.date}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                   <MapPin className="h-4 w-4 mr-2" /> Lokasi: {reg.location}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4 text-gray-400">
                <Trophy className="h-10 w-10" />
             </div>
             <p className="text-gray-500">Belum ada perlombaan yang diikuti.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
