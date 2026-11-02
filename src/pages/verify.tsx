import { Link } from "@/lib/wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";

export default function VerifyPage() {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-gray-50">
      <SEO title="Verifikasi Akun" noIndex />
      <div className="w-full max-w-md bg-white min-h-[100dvh] flex flex-col relative shadow-xl p-6 pt-12">
        
        <div className="w-full flex justify-start mb-8">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi OTP</h1>
          <p className="text-gray-500 text-sm">
            Masukkan 4 digit kode yang telah kami kirimkan ke email/nomor Anda.
          </p>
        </div>

        <div className="flex justify-between gap-3 mb-8">
           {[1, 2, 3, 4].map((i) => (
             <input 
               key={i} 
               type="text" 
               maxLength={1} 
               className="w-16 h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
               placeholder="-"
             />
           ))}
        </div>

        <Button className="w-full py-6 rounded-xl text-base shadow-lg shadow-primary/30 font-bold mb-6" asChild>
           <Link href="/">Verifikasi & Masuk</Link>
        </Button>

        <p className="text-center text-sm text-gray-600">
           Belum menerima kode? <button className="font-bold text-primary hover:underline">Kirim Ulang</button>
        </p>

      </div>
    </div>
  );
}
