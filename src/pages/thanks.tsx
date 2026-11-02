import { Link } from "@/lib/wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";

export default function ThanksPage() {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-gray-50">
      <SEO title="Pembayaran Berhasil" noIndex />
      <div className="w-full max-w-md bg-white min-h-[100dvh] flex flex-col relative shadow-xl items-center justify-center p-6 text-center">
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-float-slow">
           <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Terima kasih atas pesanan Anda. E-ticket dan detail pesanan telah dikirimkan ke email Anda.
        </p>

        <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 text-left">
           <p className="text-xs text-gray-500 mb-1">Order ID</p>
           <p className="font-bold text-gray-900 mb-3">ORD-8392019</p>
           
           <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
           <p className="font-bold text-primary text-lg">Rp 100.000</p>
        </div>

        <div className="w-full space-y-3">
           <Button className="w-full py-6 rounded-xl text-base shadow-lg shadow-primary/30" asChild>
              <Link href="/pesanan-saya">Lihat Pesanan Saya</Link>
           </Button>
           <Button variant="outline" className="w-full py-6 rounded-xl border-gray-200 text-gray-700" asChild>
              <Link href="/">Kembali ke Beranda</Link>
           </Button>
        </div>

      </div>
    </div>
  );
}
