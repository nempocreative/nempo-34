import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { CreditCard, Wallet, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  return (
    <Layout>
      <SEO title="Pembayaran" noIndex />
      <div className="flex flex-col min-h-[calc(100vh-4rem-6rem)]">
        <div className="p-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pembayaran</h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
             <h3 className="font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100">Ringkasan Pesanan</h3>
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Harga (3 Barang)</span>
                <span className="text-sm font-semibold text-gray-900">Rp 100.000</span>
             </div>
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Biaya Layanan</span>
                <span className="text-sm font-semibold text-gray-900">Rp 2.000</span>
             </div>
             <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total Pembayaran</span>
                <span className="font-bold text-primary text-lg">Rp 102.000</span>
             </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-3">Metode Pembayaran</h3>
          
          <div className="flex flex-col gap-3">
             <label className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-50 p-2 rounded-xl">
                      <Wallet className="h-5 w-5 text-blue-600" />
                   </div>
                   <span className="font-medium text-gray-900">E-Wallet (OVO, GoPay, Dana)</span>
                </div>
                <input type="radio" name="payment_method" className="w-5 h-5 text-primary" defaultChecked />
             </label>
             
             <label className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="bg-green-50 p-2 rounded-xl">
                      <Building2 className="h-5 w-5 text-green-600" />
                   </div>
                   <span className="font-medium text-gray-900">Transfer Bank (Virtual Account)</span>
                </div>
                <input type="radio" name="payment_method" className="w-5 h-5 text-primary" />
             </label>

             <label className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="bg-purple-50 p-2 rounded-xl">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                   </div>
                   <span className="font-medium text-gray-900">Kartu Kredit / Debit</span>
                </div>
                <input type="radio" name="payment_method" className="w-5 h-5 text-primary" />
             </label>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] mt-auto">
           <Button className="w-full py-6 rounded-xl text-base shadow-lg shadow-primary/30 font-bold" asChild>
              <Link href="/pembayaran">Bayar Rp 102.000</Link>
           </Button>
        </div>
      </div>
    </Layout>
  );
}
