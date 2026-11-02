import { Link } from "@/lib/wouter";
import { Copy, Clock, AlertCircle } from "lucide-react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";

export default function PembayaranPage() {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-gray-50">
      <SEO title="Pembayaran" noIndex />
      <div className="w-full max-w-md bg-white min-h-[100dvh] flex flex-col relative shadow-xl">
        
        <div className="bg-primary p-6 pt-12 pb-10 rounded-b-3xl text-white text-center">
           <h1 className="text-xl font-bold mb-2">Selesaikan Pembayaran</h1>
           <p className="text-white/80 text-sm mb-4">Sisa waktu pembayaran Anda</p>
           <div className="text-3xl font-mono font-bold flex justify-center items-center gap-2">
              <Clock className="h-6 w-6" /> 14:59
           </div>
        </div>

        <div className="p-4 -mt-6">
           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6">
              <p className="text-sm text-gray-500 text-center mb-1">Transfer ke Bank BCA (Virtual Account)</p>
              <p className="text-center font-bold text-gray-900 text-2xl mb-4 tracking-widest">8077 0812 3456 7890</p>
              
              <Button variant="outline" className="w-full rounded-xl flex gap-2">
                 <Copy className="h-4 w-4" /> Salin Nomor VA
              </Button>
           </div>

           <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                 <h4 className="font-bold text-blue-900 text-sm mb-1">Instruksi Pembayaran</h4>
                 <ul className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Buka aplikasi BCA Mobile / m-BCA</li>
                    <li>Pilih menu m-Transfer {">"} BCA Virtual Account</li>
                    <li>Masukkan nomor Virtual Account di atas</li>
                    <li>Pastikan nama merchant Nempo Organizer</li>
                    <li>Konfirmasi dan masukkan PIN m-BCA Anda</li>
                 </ul>
              </div>
           </div>

           <Button className="w-full py-6 rounded-xl text-base shadow-lg shadow-primary/30 font-bold mb-3" asChild>
              <Link href="/thanks">Saya Sudah Bayar</Link>
           </Button>
           
           <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-900" asChild>
              <Link href="/payment">Ganti Metode Pembayaran</Link>
           </Button>
        </div>

      </div>
    </div>
  );
}
