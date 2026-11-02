import { Layout } from "@/components/layout";
import { Link } from "@/lib/wouter";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KeranjangPage() {
  const items = [
    { id: 1, name: "Tiket Festival Budaya Garut", price: 50000, qty: 2, image: "", type: "Tiket Event" },
    { id: 2, name: "Sewa Tenda Dome 4 Orang", price: 50000, qty: 1, image: "", type: "Rental Gear" },
  ];

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-4rem-6rem)]">
        <div className="p-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang</h1>
          
          {items.length > 0 ? (
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
                   <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                   <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                         <p className="text-[10px] text-primary font-semibold mb-0.5">{item.type}</p>
                         <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">{item.name}</h3>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                         <span className="font-bold text-gray-900 text-sm">Rp {item.price.toLocaleString()}</span>
                         <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg">
                            <button className="text-gray-500 hover:text-primary"><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                            <button className="text-gray-500 hover:text-primary"><Plus className="h-3 w-3" /></button>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <ShoppingBag className="h-10 w-10" />
               </div>
               <h3 className="font-bold text-gray-900 mb-1">Keranjang masih kosong</h3>
               <p className="text-sm text-gray-500">Yuk mulai cari tiket atau barang sewaan!</p>
               <Button className="mt-6 rounded-xl" asChild>
                  <Link href="/">Mulai Belanja</Link>
               </Button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] mt-auto">
             <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Total Pembayaran</span>
                <span className="text-xl font-bold text-primary">Rp {total.toLocaleString()}</span>
             </div>
             <Button className="w-full py-6 rounded-xl text-base shadow-lg shadow-primary/30" asChild>
                <Link href="/payment">Checkout ({items.reduce((a,b)=>a+b.qty,0)})</Link>
             </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
