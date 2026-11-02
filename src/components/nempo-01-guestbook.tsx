import { useState } from "react";
import { Heart, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Nempo01Guestbook({ guest }: { guest: string }) {
  const [name, setName] = useState(guest === "Bapak/Ibu/Saudara/i" ? "" : guest);
  const [attendance, setAttendance] = useState("Hadir");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wishes, setWishes] = useState<{ name: string; message: string; attendance: string }[]>([]);
  return <section id="rsvp" className="n01-soft n01-reveal relative scroll-mt-20 px-6 py-16">
    <div className="mx-auto max-w-xl">
      <div className="text-center"><Heart className="n01-blue mx-auto size-6"/><p className="n01-label n01-blue mt-4">Your presence, our happiness</p><h2 className="mt-3 text-3xl">Kehadiran & doa Anda</h2><p className="n01-body mt-3 text-xs leading-6">Satu ucapan kecil, kebahagiaan yang berarti.</p></div>
      <form className="n01-body mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); if (!name.trim() || !message.trim()) return; setWishes((current) => [{ name: name.trim(), message: message.trim(), attendance }, ...current]); setSubmitted(true); setMessage(""); }}>
        <div><label htmlFor="n01-name" className="mb-2 block text-xs font-semibold">Nama Anda</label><Input id="n01-name" value={name} onChange={(event)=>{setName(event.target.value);setSubmitted(false);}} required maxLength={80} placeholder="Nama lengkap"/></div>
        <fieldset><legend className="mb-2 text-xs font-semibold">Konfirmasi kehadiran</legend><div className="grid grid-cols-3 gap-2">{["Hadir","Belum pasti","Tidak hadir"].map((value)=><Button key={value} type="button" variant={attendance===value?"default":"outline"} aria-pressed={attendance===value} onClick={()=>setAttendance(value)} className="h-auto whitespace-normal px-2 text-xs">{value}</Button>)}</div></fieldset>
        {attendance==="Hadir" && <div><label htmlFor="n01-count" className="mb-2 block text-xs font-semibold">Jumlah tamu</label><Input id="n01-count" type="number" min={1} max={10} defaultValue={1} required/></div>}
        <div><label htmlFor="n01-wish" className="mb-2 block text-xs font-semibold">Ucapan & doa</label><Textarea id="n01-wish" value={message} onChange={(event)=>setMessage(event.target.value)} required maxLength={600} placeholder="Tuliskan doa terbaik untuk kedua mempelai…" className="min-h-28"/></div>
        <Button type="submit" className="w-full text-xs"><Send/> Kirim ucapan</Button>
        <p className="text-[11px] leading-5 opacity-70">Pratinjau: ucapan hanya tampil selama halaman ini dibuka, belum dikirim ke pasangan.</p>
      </form>
      {submitted && <p role="status" className="n01-body n01-blue mt-4 flex items-center gap-2 text-xs"><CheckCircle2 className="size-4"/> Terima kasih, ucapan Anda tampil di pratinjau.</p>}
      <div className="mt-8 space-y-5" aria-live="polite">{wishes.map((wish,index)=><article key={index} className="n01-line n01-enter border-t pt-5"><div className="flex items-center justify-between gap-3"><h3 className="text-lg break-words">{wish.name}</h3><span className="n01-body n01-blue shrink-0 text-[10px]">{wish.attendance}</span></div><p className="n01-body mt-2 whitespace-pre-wrap break-words text-xs leading-6">{wish.message}</p></article>)}</div>
    </div>
  </section>;
}