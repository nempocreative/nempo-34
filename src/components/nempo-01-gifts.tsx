import { Gift, CreditCard, QrCode } from "lucide-react";

export function Nempo01Gifts() {
  return <section id="hadiah" className="relative mx-auto max-w-3xl px-6 py-16 text-center">
    <Gift className="n01-blue mx-auto size-7" strokeWidth={1}/><p className="n01-label n01-blue mt-4">Wedding gift</p><h2 className="mt-3 text-3xl">Tanda kasih</h2><p className="n01-body mx-auto mt-4 max-w-md text-xs leading-7">Doa restu Anda adalah hadiah terindah bagi kami.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <article className="n01-gift n01-line relative overflow-hidden rounded-lg border p-6 text-left"><CreditCard className="n01-blue size-6"/><p className="n01-label n01-blue mt-5">Transfer bank</p><p className="mt-3 text-2xl">•••• •••• ••••</p><p className="n01-body mt-3 text-xs">Atas nama mempelai</p><p className="n01-body mt-5 text-[11px] leading-6 opacity-70">Contoh kartu · nomor rekening belum tersedia.</p></article>
      <article className="n01-gift n01-line rounded-lg border p-6 text-center"><QrCode className="n01-blue mx-auto size-16" strokeWidth={1}/><p className="n01-label n01-blue mt-4">QRIS hadiah</p><p className="n01-body mt-3 text-xs leading-6">QRIS mempelai belum tersedia.</p><p className="n01-body mt-4 text-[11px] leading-6 opacity-70">Ilustrasi, bukan kode pembayaran.</p></article>
    </div>
  </section>;
}