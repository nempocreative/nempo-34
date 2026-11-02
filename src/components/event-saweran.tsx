import { Download, Maximize2, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import qris from "@/assets/qris-nempo-garut-saweran.jpeg.asset.json";

export function EventSaweran() {
  return <section id="saweran" tabIndex={-1} className="event-saweran scroll-mt-28 border-y border-border bg-card text-foreground p-4 sm:p-6" aria-labelledby="saweran-title">
    <div className="grid gap-6 sm:grid-cols-[1fr_220px] items-center">
      <div className="min-w-0">
        <HandHeart className="size-6 text-primary mb-3" />
        <p className="text-xs font-semibold text-muted-foreground mb-2">MusiComedy Night</p>
        <h2 id="saweran-title" className="text-2xl font-extrabold">Sawer Talent</h2>
        <p className="text-sm leading-relaxed text-muted-foreground mt-3">Suka penampilannya? Kirim apresiasi lewat QRIS. Terima kasih sudah mendukung talent dan karya lokal.</p>
        <div className="mt-4 border-l-2 border-primary pl-3">
          <p className="text-xs text-muted-foreground">Nama penerima</p>
          <p className="font-bold text-sm mt-1">NEMPO GARUT</p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground mt-4">Pastikan nama penerima NEMPO GARUT sebelum membayar. Pembayaran dilakukan di aplikasi bank atau dompet digital; halaman ini tidak memverifikasi pembayaran otomatis.</p>
        <Button asChild className="mt-5"><a href={qris.url} download="QRIS-NEMPO-GARUT.jpeg"><Download />Unduh QRIS</a></Button>
      </div>
      <Dialog>
        <div className="w-full max-w-[260px] sm:max-w-[220px] mx-auto">
          <img src={qris.url} alt="QRIS saweran NEMPO GARUT" width={724} height={1021} loading="lazy" className="block w-full h-auto rounded-lg border border-border" />
          <DialogTrigger asChild><Button variant="outline" className="w-full mt-3"><Maximize2 />Perbesar QRIS</Button></DialogTrigger>
        </div>
        <DialogContent className="event-saweran bg-card text-foreground w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader><DialogTitle>QRIS NEMPO GARUT</DialogTitle><DialogDescription>Saweran MusiComedy Night</DialogDescription></DialogHeader>
          <img src={qris.url} alt="QRIS saweran NEMPO GARUT diperbesar" width={724} height={1021} className="block w-full max-h-[60dvh] object-contain" />
          <Button asChild><a href={qris.url} download="QRIS-NEMPO-GARUT.jpeg"><Download />Unduh QRIS</a></Button>
        </DialogContent>
      </Dialog>
    </div>
  </section>;
}