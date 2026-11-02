import { useState } from 'react';
import { ArrowUpRight, Eye, EyeOff, KeyRound, MapPinned, ShieldCheck } from 'lucide-react';
import { apiOrigin, login } from '@/apps/cms/lib/api';

export default function LoginPage({onLogin}:{onLogin:(token:string)=>void}) {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [visible,setVisible]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function submit(e:React.FormEvent){e.preventDefault();setError('');setBusy(true);try{onLogin(await login(username,password));}catch(e){setError(e instanceof Error?e.message:'Layanan masuk tidak tersedia.');}finally{setBusy(false);}}
  const configured=Boolean(apiOrigin());
  return <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f3eee5] px-4 py-8">
    <div className="absolute -right-24 -top-24 h-[440px] w-[440px] rounded-full border border-[#dfd0bb]/70"/><div className="absolute -right-8 -top-8 h-[310px] w-[310px] rounded-full border border-[#dfd0bb]/60"/><div className="absolute bottom-[-160px] left-[-100px] h-[380px] w-[380px] rounded-full border border-[#dfd0bb]/70"/>
    <div className="relative grid w-full max-w-[1000px] overflow-hidden rounded-[24px] border border-[#e5dacb] bg-[#fffdf9] shadow-[0_28px_90px_rgba(74,52,31,.12)] md:grid-cols-[1.04fr_.96fr]">
      <section className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#3a2e25] p-7 text-[#fffaf3] sm:p-10 md:min-h-[610px]">
        <div className="absolute right-[-70px] top-[-85px] h-[360px] w-[360px] rounded-full border border-[#c1a273]/25"/><div className="absolute right-[-15px] top-[-28px] h-[250px] w-[250px] rounded-full border border-[#c1a273]/20"/><div className="absolute bottom-14 right-8 h-[165px] w-[165px] rounded-full bg-[#756344]/20 blur-2xl"/>
        <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f2e5d2] text-[#70452b]"><img src={`${"/cms/"}Assets/Logo/nempo-new.webp`} alt="Nempo Organizer" className="h-8 w-8 object-contain" onError={e=>{e.currentTarget.style.display='none';}}/><span className="absolute text-sm font-bold">N</span></div><div><p className="text-sm font-bold tracking-tight">NEMPO ORGANIZER</p><p className="text-[10px] font-semibold uppercase tracking-[.19em] text-[#c6b8a4]">Admin CMS Garut</p></div></div>
        <div className="relative mt-10 md:mt-0"><div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#d6bb8f]"><MapPinned size={13}/> Garut, Jawa Barat</div><h1 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-5xl">Ruang kerja yang menjaga Garut tetap <span className="font-normal italic text-[#d8bd92]">terhubung.</span></h1><p className="mt-5 max-w-sm text-sm leading-6 text-[#d2c6b9]">Kelola informasi destinasi, layanan lokal, agenda, dan berita dengan tenang dan akurat.</p></div>
        <div className="relative mt-10 flex items-center gap-2 text-[10px] tracking-wide text-[#b6a894] md:mt-0"><ShieldCheck size={14} className="text-[#d8bd92]"/> Akses khusus petugas Nempo Organizer</div>
      </section>
      <section className="flex flex-col justify-center px-6 py-9 sm:px-10 md:px-12">
        <div className="mb-8"><div className="mb-2 font-mono text-[10px] font-bold tracking-[.2em] text-[#9c7954]">PORTAL PETUGAS / 01</div><h2 className="text-2xl font-bold tracking-[-.04em] text-[#382d23]">Selamat datang</h2><p className="mt-1.5 text-sm text-[#8b7d6c]">Masuk untuk melanjutkan pekerjaan konten.</p></div>
        {!configured&&<div className="mb-5 rounded-xl border border-[#ead8c7] bg-[#fbf3e9] p-3.5"><p className="text-xs font-bold text-[#70472e]">API belum dikonfigurasi</p><p className="mt-1 text-[11px] leading-5 text-[#896d55]">Atur <code className="rounded bg-[#f1e5d7] px-1 py-0.5 font-mono">VITE_NEMPO_GARUT_API_URL</code> pada environment artifact ini untuk mengaktifkan login. Tidak ada data contoh atau layanan cadangan.</p></div>}
        <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#625343]">Username</span><input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required placeholder="Nama pengguna" className="h-11 w-full rounded-lg border border-[#e6dccf] bg-[#fcfaf6] px-3.5 text-sm text-[#3e3328] outline-none transition focus:border-[#a9845b] focus:ring-2 focus:ring-[#a9845b]/15"/></label>
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#625343]">Password</span><span className="relative block"><input autoComplete="current-password" type={visible?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Masukkan password" className="h-11 w-full rounded-lg border border-[#e6dccf] bg-[#fcfaf6] px-3.5 pr-11 text-sm text-[#3e3328] outline-none transition focus:border-[#a9845b] focus:ring-2 focus:ring-[#a9845b]/15"/><button type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible?'Sembunyikan password':'Tampilkan password'} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#9b8b78] hover:text-[#604a36]">{visible?<EyeOff size={16}/>:<Eye size={16}/>}</button></span></label>
          {error&&<div className="rounded-lg border border-[#ead4c8] bg-[#fcf2ed] px-3 py-2.5 text-xs leading-5 text-[#8f4d3b]">{error}</div>}
          <button disabled={busy||!configured} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#805538] text-xs font-bold text-white shadow-sm transition hover:bg-[#67432d] disabled:cursor-not-allowed disabled:opacity-50">{busy?<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/>:<KeyRound size={15}/>}Masuk ke dashboard<ArrowUpRight size={14}/></button>
        </form>
        <p className="mt-7 border-t border-[#eee6db] pt-5 text-center text-[10px] text-[#a19383]">Nempo Organizer · Sistem pengelolaan konten Garut</p>
      </section>
    </div>
  </main>;
}
